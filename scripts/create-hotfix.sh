#!/bin/bash

# Script pour créer une branche hotfix depuis main
# Usage: ./scripts/create-hotfix.sh nom-hotfix

if [ -z "$1" ]; then
    echo "❌ Erreur: Veuillez spécifier un nom de hotfix"
    echo "Usage: ./scripts/create-hotfix.sh nom-hotfix"
    exit 1
fi

hotfix_name=$1

echo "🚨 Création de la branche hotfix/$hotfix_name..."

# Vérifier qu'on est sur main
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  Vous n'êtes pas sur la branche main. Basculement..."
    git checkout main
fi

# Mettre à jour main
echo "📥 Mise à jour de main..."
git pull origin main

# Créer la nouvelle branche hotfix
echo "🔧 Création de hotfix/$hotfix_name..."
git checkout -b hotfix/$hotfix_name

echo "✅ Branche hotfix/$hotfix_name créée avec succès !"
echo "🚨 Cette branche est pour les corrections urgentes en production"
echo "💡 Après correction, mergez vers main ET develop"
