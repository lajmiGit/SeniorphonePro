#!/bin/bash

# Script pour créer une branche release depuis develop
# Usage: ./scripts/create-release.sh version

if [ -z "$1" ]; then
    echo "❌ Erreur: Veuillez spécifier une version"
    echo "Usage: ./scripts/create-release.sh v1.2.0"
    exit 1
fi

version=$1

echo "🎯 Création de la branche release/$version..."

# Vérifier qu'on est sur develop
current_branch=$(git branch --show-current)
if [ "$current_branch" != "develop" ]; then
    echo "⚠️  Vous n'êtes pas sur la branche develop. Basculement..."
    git checkout develop
fi

# Mettre à jour develop
echo "📥 Mise à jour de develop..."
git pull origin develop

# Créer la nouvelle branche release
echo "📦 Création de release/$version..."
git checkout -b release/$version

echo "✅ Branche release/$version créée avec succès !"
echo "📋 Préparez maintenant votre release :"
echo "   - Mettez à jour la version dans package.json"
echo "   - Mettez à jour le CHANGELOG.md"
echo "   - Testez tout le code"
echo "   - Puis mergez vers main ET develop"
