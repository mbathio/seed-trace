#!/bin/bash

echo "🔧 Correction du problème de démarrage..."

# 1. Créer le fichier nodemon.json corrigé
echo "📝 Création de nodemon.json..."
cat > nodemon.json << 'EOF'
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.test.ts", "src/**/*.spec.ts", "dist", "node_modules"],
  "exec": "ts-node src/server.ts",
  "env": {
    "NODE_ENV": "development"
  },
  "legacyWatch": true,
  "delay": 1000
}
EOF

# 2. Supprimer le fichier nodemon.json mal placé
rm -f src/utils/nodemon.json 2>/dev/null

# 3. Créer le dossier logs s'il n'existe pas
mkdir -p logs

# 4. Vérifier que ts-node est installé
echo "📦 Vérification de ts-node..."
if ! npm list ts-node >/dev/null 2>&1; then
    echo "Installation de ts-node..."
    npm install --save-dev ts-node
fi

# 5. Corriger le tsconfig.json
echo "⚙️ Correction de tsconfig.json..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts",
    "prisma/**/*"
  ],
  "ts-node": {
    "esm": false,
    "compilerOptions": {
      "module": "commonjs",
      "target": "ES2020"
    }
  }
}
EOF

echo "✅ Corrections appliquées !"
echo ""
echo "🚀 Commandes disponibles :"
echo "npm run dev           # Démarrer en mode développement"
echo "npm run dev:ts-node   # Alternative avec ts-node direct"
echo "npm run build         # Compiler le projet"
echo "npm start             # Démarrer en mode production"
echo ""
echo "🔍 Test de démarrage..."
echo "Essayez maintenant : npm run dev"