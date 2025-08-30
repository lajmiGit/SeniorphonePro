#!/bin/bash

# Script pour créer une nouvelle branche feature
# Usage: ./scripts/create-feature.sh nom-feature

if [ -z "$1" ]; then
    echo "❌ Erreur: Veuillez spécifier un nom de feature"
    echo "Usage: ./scripts/create-feature.sh nom-feature"
    exit 1
fi

feature_name=$1

echo "🚀 Création de la branche feature/$feature_name..."

# Vérifier qu'on est sur develop
current_branch=$(git branch --show-current)
if [ "$current_branch" != "develop" ]; then
    echo "⚠️  Vous n'êtes pas sur la branche develop. Basculement..."
    git checkout develop
fi

# Mettre à jour develop
echo "📥 Mise à jour de develop..."
git pull origin develop

# Créer la nouvelle branche feature
echo "🌿 Création de feature/$feature_name..."
git checkout -b feature/$feature_name

echo "✅ Branche feature/$feature_name créée avec succès !"
echo "📝 Vous pouvez maintenant développer votre fonctionnalité"
echo "💡 N'oubliez pas de faire des commits réguliers avec des messages clairs"
