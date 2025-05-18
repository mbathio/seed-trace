#!/bin/bash

# Script de configuration pour le projet ISRA Seed Traceability API
# Ce script permet d'initialiser l'environnement de développement rapidement

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Afficher l'en-tête
echo -e "${BOLD}======================================================${NC}"
echo -e "${BOLD}   Configuration de l'API ISRA Seed Traceability${NC}"
echo -e "${BOLD}======================================================${NC}"
echo -e "Ce script va configurer votre environnement de développement\n"

# Vérifier si Node.js est installé
if ! [ -x "$(command -v node)" ]; then
  echo -e "${RED}Erreur: Node.js n'est pas installé.${NC}"
  echo -e "Veuillez installer Node.js (v16+) depuis https://nodejs.org/"
  exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ $NODE_VERSION -lt 16 ]; then
  echo -e "${YELLOW}Attention: Vous utilisez Node.js v$(node -v)${NC}"
  echo -e "${YELLOW}Ce projet recommande Node.js v16 ou supérieur.${NC}"
  
  read -p "Voulez-vous continuer quand même? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
else
  echo -e "${GREEN}✓ Node.js v$(node -v) détecté${NC}"
fi

# Vérifier si npm est installé
if ! [ -x "$(command -v npm)" ]; then
  echo -e "${RED}Erreur: npm n'est pas installé.${NC}"
  exit 1
else
  echo -e "${GREEN}✓ npm v$(npm -v) détecté${NC}"
fi

# Installer les dépendances
echo -e "\n${BOLD}Installation des dépendances...${NC}"
npm install

if [ $? -ne 0 ]; then
  echo -e "${RED}Erreur lors de l'installation des dépendances.${NC}"
  exit 1
else
  echo -e "${GREEN}✓ Dépendances installées avec succès${NC}"
fi

# Vérifier si .env existe, sinon le créer
if [ ! -f .env ]; then
  echo -e "\n${BOLD}Configuration des variables d'environnement...${NC}"
  
  # Vérifier si .env.example existe
  if [ -f .env.example ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Fichier .env créé à partir de .env.example${NC}"
    echo -e "${YELLOW}N'oubliez pas de modifier les valeurs dans le fichier .env${NC}"
  else
    echo -e "${YELLOW}Création d'un fichier .env par défaut...${NC}"
    
    # Générer un JWT_SECRET aléatoire
    JWT_SECRET=$(openssl rand -base64 32)
    
    # Créer le fichier .env
    cat > .env << EOL
# Configuration de la base de données
DATABASE_URL="postgresql://postgres:password@localhost:5432/isra_seeds?schema=public"

# JWT (JSON Web Token)
JWT_SECRET="${JWT_SECRET}"
JWT_EXPIRES_IN="1d"

# Configuration du serveur
PORT=5000
NODE_ENV="development"

# Configuration CORS (Cross-Origin Resource Sharing)
CORS_ORIGIN="http://localhost:3000"
EOL
    
    echo -e "${GREEN}✓ Fichier .env créé avec des valeurs par défaut${NC}"
    echo -e "${YELLOW}  → N'oubliez pas de modifier l'URL de la base de données dans le fichier .env${NC}"
  fi
else
  echo -e "\n${GREEN}✓ Le fichier .env existe déjà${NC}"
fi

# Demander si l'utilisateur veut générer les clients Prisma
echo -e "\n${BOLD}Génération des clients Prisma...${NC}"
npx prisma generate

if [ $? -ne 0 ]; then
  echo -e "${RED}Erreur lors de la génération des clients Prisma.${NC}"
  exit 1
else
  echo -e "${GREEN}✓ Clients Prisma générés avec succès${NC}"
fi

# Demander si l'utilisateur veut créer la base de données et appliquer les migrations
echo -e "\n${BOLD}Configuration de la base de données...${NC}"
read -p "Voulez-vous appliquer les migrations à la base de données? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Application des migrations...${NC}"
  npx prisma migrate dev --name init
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Erreur lors de l'application des migrations.${NC}"
    echo -e "${YELLOW}Assurez-vous que PostgreSQL est installé et que les informations de connexion dans .env sont correctes.${NC}"
  else
    echo -e "${GREEN}✓ Migrations appliquées avec succès${NC}"
    
    # Demander si l'utilisateur veut alimenter la base de données
    read -p "Voulez-vous alimenter la base de données avec des données initiales? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${YELLOW}Alimentation de la base de données...${NC}"
      npm run seed
      
      if [ $? -ne 0 ]; then
        echo -e "${RED}Erreur lors de l'alimentation de la base de données.${NC}"
      else
        echo -e "${GREEN}✓ Base de données alimentée avec succès${NC}"
      fi
    fi
  fi
fi

# Proposer de compiler le projet
echo -e "\n${BOLD}Compilation du projet...${NC}"
read -p "Voulez-vous compiler le projet? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Compilation en cours...${NC}"
  npm run build
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Erreur lors de la compilation.${NC}"
  else
    echo -e "${GREEN}✓ Compilation réussie${NC}"
  fi
fi

# Afficher des instructions pour démarrer le serveur
echo -e "\n${BOLD}======================================================${NC}"
echo -e "${GREEN}✓ Configuration terminée avec succès!${NC}"
echo -e "${BOLD}======================================================${NC}"
echo -e "\nPour démarrer le serveur en mode développement:"
echo -e "  ${YELLOW}npm run dev${NC}"
echo -e "\nPour démarrer le serveur en mode production:"
echo -e "  ${YELLOW}npm start${NC}"
echo -e "\nAutres commandes utiles:"
echo -e "  ${YELLOW}npm run prisma:studio${NC}  - Ouvrir l'interface Prisma Studio"
echo -e "  ${YELLOW}npm test${NC}               - Exécuter les tests"
echo -e "  ${YELLOW}npm run build${NC}          - Compiler le projet"
echo -e "\nDocumentation:"
echo -e "  Consultez le fichier ${BOLD}README.md${NC} pour plus d'informations."
echo -e "  Pour les développeurs, consultez le fichier ${BOLD}DEVELOPER.md${NC}."
echo -e "\n${BOLD}======================================================${NC}"

# Demander si l'utilisateur veut démarrer le serveur maintenant
read -p "Voulez-vous démarrer le serveur en mode développement maintenant? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Démarrage du serveur...${NC}"
  npm run dev
fi