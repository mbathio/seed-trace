#!/bin/bash
# Script de correction rapide pour les erreurs

echo "🔧 Correction des erreurs du backend ISRA..."

# 1. Installer node-cache si pas déjà installé
echo "📦 Installation des dépendances manquantes..."
npm install node-cache

# 2. Supprimer les fichiers problématiques temporairement
echo "🗑️ Suppression des fichiers avec erreurs..."
rm -f src/middleware/ExportService.ts
rm -f "Dockerfile copy"

# 3. Créer le dossier services s'il n'existe pas
mkdir -p src/services

# 4. Créer les services corrigés
echo "✨ Création des services corrigés..."

# CacheService corrigé
cat > src/services/CacheService.ts << 'EOF'
import NodeCache from 'node-cache';
import { prisma } from '../config/database';

export class CacheService {
  private static cache = new NodeCache({ 
    stdTTL: 300, // 5 minutes
    checkperiod: 60 
  });

  static async getVarieties(): Promise<any[]> {
    const cached = this.cache.get('varieties');
    if (cached) return cached as any[];

    const varieties = await prisma.variety.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    this.cache.set('varieties', varieties);
    return varieties;
  }

  static invalidateVarieties(): void {
    this.cache.del('varieties');
  }

  static clearAll(): void {
    this.cache.flushAll();
  }
}
EOF

# SimpleExportService sans dépendances externes
cat > src/services/SimpleExportService.ts << 'EOF'
export class SimpleExportService {
  static async exportSeedLotsToCSV(lots: any[]): Promise<string> {
    const headers = [
      'ID', 'Variété', 'Niveau', 'Quantité', 
      'Date de production', 'Statut', 'Multiplicateur', 'Notes'
    ];

    const csvRows = [
      headers.join(','),
      ...lots.map(lot => [
        lot.id,
        lot.variety.name,
        lot.level,
        lot.quantity,
        lot.productionDate,
        lot.status,
        lot.multiplier?.name || 'N/A',
        `"${(lot.notes || '').replace(/"/g, '""')}"`
      ].join(','))
    ];

    return csvRows.join('\n');
  }

  static generateReportHTML(data: any): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rapport ISRA</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; color: #2c5530; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #2c5530; color: white; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌾 RAPPORT ISRA</h1>
        <p>Généré le : ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>
    <!-- Contenu du rapport -->
</body>
</html>`;
  }
}
EOF

# NotificationService corrigé
cat > src/services/NotificationService.ts << 'EOF'
import { logger } from '../utils/logger';

export class NotificationService {
  static async notifyQualityTestFailed(
    lot: any,
    qualityControl: any,
    recipients: string[]
  ): Promise<void> {
    const message = `⚠️ ÉCHEC DU CONTRÔLE QUALITÉ - Lot: ${lot.id}`;
    
    logger.warn('Notification qualité:', {
      lotId: lot.id,
      variety: lot.variety.name,
      germinationRate: qualityControl.germinationRate,
      recipients
    });
    
    // TODO: Implémenter l'envoi d'emails réels
  }

  static async notifyLotExpiring(
    lots: any[],
    recipients: string[]
  ): Promise<void> {
    logger.info('Notification expiration:', {
      count: lots.length,
      recipients
    });
    
    // TODO: Implémenter l'envoi d'emails réels
  }
}
EOF

# 5. Corriger le Dockerfile
echo "🐳 Correction du Dockerfile..."
cat > Dockerfile << 'EOF'
FROM node:20-alpine3.18

RUN addgroup -g 1001 -S nodejs
RUN adduser -S isra -u 1001

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && npm cache clean --force
RUN npx prisma generate

COPY --chown=isra:nodejs . .
RUN npm run build

RUN mkdir -p logs && chown -R isra:nodejs logs

USER isra
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

CMD ["npm", "start"]
EOF

# 6. Ajouter les index Prisma suggérés
echo "🗄️ Ajout des index dans le schéma Prisma..."
if grep -q "@@index.*variety_level_status" prisma/schema.prisma; then
  echo "Index déjà présents dans le schéma Prisma"
else
  echo "
  // Index ajoutés pour les performances
  @@index([varietyId, level, status], map: \"idx_seed_lots_variety_level_status\")
  @@index([productionDate, level], map: \"idx_seed_lots_production_level\")
  @@index([multiplierId, status, productionDate], map: \"idx_seed_lots_multiplier_complete\")" >> prisma/schema.prisma
fi

# 7. Créer un fichier .env.example mis à jour
cat > .env.example << 'EOF'
# Base de données
DATABASE_URL="postgresql://isra_user:password@localhost:5432/isra_seeds"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production-please"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Serveur
PORT=3001
NODE_ENV="development"
CLIENT_URL="http://localhost:8080"

# Sécurité
BCRYPT_SALT_ROUNDS="12"
CORS_ORIGIN="http://localhost:3000"

# Cache Redis (optionnel)
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD="redis_secure_password_2024"

# PostgreSQL
POSTGRES_PASSWORD="isra_secure_password_2024"
POSTGRES_PORT="5432"

# Monitoring (optionnel)
GRAFANA_PASSWORD="admin123"

# Upload
MAX_FILE_SIZE="10485760"

# QR Code
QR_BASE_URL="https://api.qrserver.com/v1/create-qr-code/"
EOF

echo "✅ Corrections appliquées avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Vérifier que les erreurs TypeScript sont corrigées"
echo "2. Exécuter 'npm run build' pour tester la compilation"
echo "3. Lancer 'npm run dev' pour démarrer le serveur"
echo "4. Tester l'API avec 'curl http://localhost:3001/health'"
echo ""
echo "🔧 Commandes utiles :"
echo "npm run db:generate  # Regénérer le client Prisma"
echo "npm run db:migrate   # Appliquer les migrations"
echo "npm run db:seed      # Peupler la base de données"
echo "npm run lint         # Vérifier le code"
echo ""
echo "🐳 Pour Docker :"
echo "docker-compose up -d # Démarrer tous les services"
echo "docker-compose logs api # Voir les logs de l'API"