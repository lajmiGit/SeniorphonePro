#!/bin/bash

# Script pour merger une feature vers develop
# Usage: ./scripts/merge-feature.sh nom-feature

if [ -z "$1" ]; then
    echo "❌ Erreur: Veuillez spécifier un nom de feature"
    echo "Usage: ./scripts/merge-feature.sh nom-feature"
    exit 1
fi

feature_name=$1

echo "🔄 Merge de feature/$feature_name vers develop..."

# Vérifier qu'on est sur develop
current_branch=$(git branch --show-current)
if [ "$current_branch" != "develop" ]; then
    echo "⚠️  Vous n'êtes pas sur la branche develop. Basculement..."
    git checkout develop
fi

# Mettre à jour develop
echo "📥 Mise à jour de develop..."
git pull origin develop

# Merger la feature
echo "🔀 Merge de feature/$feature_name..."
git merge feature/$feature_name

# Pousser les changements
echo "📤 Push vers origin/develop..."
git push origin develop

# Supprimer la branche feature locale
echo "🗑️  Suppression de la branche feature locale..."
git branch -d feature/$feature_name

echo "✅ Feature/$feature_name mergée avec succès !"
echo "💡 N'oubliez pas de supprimer la branche sur GitHub si nécessaire"
