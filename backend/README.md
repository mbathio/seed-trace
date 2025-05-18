# Documentation Technique - ISRA Seed Traceability API

Cette documentation fournit des détails techniques sur l'API de traçabilité des semences de l'ISRA Saint-Louis, destinée aux développeurs qui travaillent sur ce projet.

## Architecture du système

L'application suit une architecture RESTful avec une séparation en couches :

1. **Couche de routage** (`routes/`) : Définit les endpoints de l'API et dirige les requêtes vers les contrôleurs appropriés
2. **Couche de contrôleurs** (`controllers/`) : Gère la logique métier pour chaque entité
3. **Couche d'accès aux données** : Utilise Prisma ORM pour communiquer avec la base de données PostgreSQL
4. **Middlewares** (`middleware/`) : Fonctionnalités transversales comme l'authentification et la validation
5. **Services** (`services/`) : Logique métier partagée et fonctionnalités réutilisables

### Diagramme de l'architecture

```
Client <--> Serveur Express (routes) <--> Contrôleurs <--> Prisma ORM <--> PostgreSQL
              |
              |--> Middlewares (Auth, Validation, Erreurs)
              |--> Services (QR, Rapports, Parcelles, etc.)
```

## Modèle de données

Le schéma de la base de données est défini dans `prisma/schema.prisma`. Voici les principales entités :

- **User** : Utilisateurs du système avec différents rôles
- **SeedVariety** : Variétés de semences
- **SeedLot** : Lots de semences avec traçabilité parentale
- **QualityControl** : Tests de qualité effectués sur les lots
- **Parcel** : Parcelles de terre utilisées pour la production
- **Production** : Détails de la production sur une parcelle
- **Multiplier** : Entités qui reçoivent des semences
- **DistributedLot** : Enregistrements des distributions aux multiplicateurs

### Relations clés

- **SeedLot** a une relation `1:N` avec lui-même pour la généalogie (parentLot -> childLots)
- **SeedLot** appartient à une **SeedVariety** (`N:1`)
- **QualityControl** appartient à un **SeedLot** (`N:1`)
- **Production** relie un **SeedLot** à une **Parcel** (`N:1` des deux côtés)
- **DistributedLot** relie un **SeedLot** à un **Multiplier** (`N:1` des deux côtés)

## Flux d'authentification

L'API utilise JWT (JSON Web Token) pour l'authentification :

1. **Connexion** :

   - Endpoint : `POST /api/auth/login`
   - Requête : `{ email, password }`
   - Réponse : `{ token, user: { id, name, email, role } }`

2. **Vérification du token** :

   - Le middleware `authenticate` extrait le token de l'en-tête `Authorization`
   - Vérifie sa validité avec JWT
   - Charge les informations de l'utilisateur depuis la base de données
   - Ajoute `req.user` pour les requêtes authentifiées

3. **Autorisation** :
   - Le middleware `authorize` vérifie si l'utilisateur a les rôles requis
   - Utilisé sur les routes qui nécessitent des permissions spécifiques

## Gestion des rôles

Le système utilise un modèle RBAC (Role-Based Access Control) :

| Rôle       | Description                               | Permissions principales                 |
| ---------- | ----------------------------------------- | --------------------------------------- |
| ADMIN      | Administrateur système                    | Tout                                    |
| MANAGER    | Gestionnaire des semences                 | Rapports, Multiplicateurs, Approbations |
| RESEARCHER | Chercheur travaillant sur les variétés    | Variétés, Lots GO                       |
| TECHNICIAN | Technicien de laboratoire                 | Lots, Contrôles qualité                 |
| INSPECTOR  | Inspecteur de qualité                     | Contrôles qualité                       |
| MULTIPLIER | Utilisateur externe recevant des semences | Voir ses propres lots                   |

## Génération des codes QR

Le service `QRService` génère des codes QR pour les lots de semences :

- Utilise la bibliothèque `qrcode`
- Encode les informations clés du lot (ID, variété, niveau, date de production)
- Les codes QR sont stockés au format Data URL dans la base de données
- Endpoints:
  - `GET /api/seed-lots/:id/qrcode` pour générer/récupérer le QR code d'un lot

## Validation des données

Le middleware `validation.middleware.ts` fournit un système de validation générique :

```typescript
// Exemple d'utilisation
const lotValidationSchema = {
  varietyId: { required: true, type: "number" },
  level: { required: true, enum: ["GO", "G1", "G2", "G3", "R1", "R2"] },
  quantity: { required: true, type: "number", min: 0 },
  productionDate: { required: true, type: "date" },
};

router.post("/", authenticate, validate(lotValidationSchema), createSeedLot);
```

## Gestion des erreurs

Le système utilise un middleware de gestion d'erreurs centralisé :

- `error.middleware.ts` définit des fonctions d'assistance pour créer des erreurs typées
- Toutes les erreurs sont interceptées et formatées uniformément
- Les statuts HTTP appropriés sont appliqués
- Le mode développement inclut des informations de débogage supplémentaires

## Rapports et statistiques

Le service `ReportService` génère des rapports et des statistiques :

- Statistiques de production par variété
- Statistiques de qualité
- Statistiques des multiplicateurs
- Statistiques des parcelles
- Rapports complets sur les lots et leur traçabilité

## Tests

Les tests sont écrits avec Jest et supertest :

- Tests unitaires pour la logique métier
- Tests d'intégration pour les API
- Tests de validation pour les schémas de données

Pour exécuter les tests :

```bash
npm test
```

## Pagination et filtrage des résultats

La plupart des endpoints de liste supportent la pagination et le filtrage :

- Pagination avec `?page=1&limit=10`
- Filtrage avec des paramètres spécifiques, par exemple `?level=GO&status=ACTIVE`
- Recherche avec `?search=terme`

## Cycle de vie d'un lot de semences

1. **Création** : Un lot GO est créé (sans parent) ou un lot dérivé est créé à partir d'un lot parent
2. **Production** : Le lot est associé à une parcelle pour la production
3. **Contrôle qualité** : Des tests sont effectués pour vérifier la qualité
4. **Distribution** : Le lot peut être distribué à des multiplicateurs

## Configuration de l'environnement de développement

### Variables d'environnement

```
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/isra_seeds?schema=public"

# JWT
JWT_SECRET="votre_secret_jwt_très_sécurisé"
JWT_EXPIRES_IN="1d"

# Serveur
PORT=5000
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

### Scripts NPM

- `npm run dev` : Démarrer le serveur en mode développement avec nodemon
- `npm run build` : Compiler les fichiers TypeScript
- `npm start` : Démarrer le serveur en mode production
- `npm test` : Exécuter les tests
- `npm run seed` : Alimenter la base de données avec des données initiales
- `npm run prisma:migrate` : Créer/appliquer les migrations de la base de données
- `npm run prisma:generate` : Générer les types Prisma
- `npm run prisma:studio` : Ouvrir Prisma Studio pour explorer la base de données

## Bonnes pratiques

1. **Transactions** : Utiliser les transactions Prisma pour les opérations multi-tables
2. **Validation** : Valider toutes les entrées utilisateur avec le middleware de validation
3. **Logging** : Logger les erreurs et les événements importants
4. **Tests** : Écrire des tests pour les nouvelles fonctionnalités
5. **Commentaires** : Documenter les fonctions et méthodes complexes

## Ressources supplémentaires

- [Documentation Prisma](https://www.prisma.io/docs/)
- [Documentation Express](https://expressjs.com/fr/api.html)
- [Documentation JWT](https://github.com/auth0/node-jsonwebtoken#readme)
- [Documentation QRCode](https://github.com/soldair/node-qrcode#readme)

## Dépannage

### Problèmes courants

1. **Erreurs de migration Prisma** :

   - Solution : `npx prisma migrate reset` pour réinitialiser la base de données

2. **Problèmes d'authentification** :

   - Vérifier la validité du JWT_SECRET
   - Vérifier l'expiration du token

3. **Erreurs de validation** :
   - Vérifier les formats des entrées utilisateur
   - Consulter les journaux pour les détails précis

## Extension du projet

Pour ajouter une nouvelle entité au projet :

1. Ajouter le modèle dans `prisma/schema.prisma`
2. Exécuter `npm run prisma:migrate` pour créer la migration
3. Créer le contrôleur dans `src/controllers/`
4. Créer les routes dans `src/routes/`
5. Ajouter les routes au fichier `src/routes/index.ts`
6. Écrire des tests pour les nouvelles fonctionnalités

## Contact et assistance

Pour toute question technique, contactez l'équipe de développement à dev@isra-saintlouis.sn.
