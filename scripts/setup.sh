#!/bin/bash

# Script de configuration pour SeniorPhonePro
# Ce script configure automatiquement l'environnement de développement

echo "🚀 Configuration de SeniorPhonePro..."

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer avec Node.js"
    exit 1
fi

# Vérifier Expo CLI
if ! command -v expo &> /dev/null; then
    echo "📦 Installation d'Expo CLI..."
    npm install -g @expo/cli
fi

echo "✅ Prérequis vérifiés"

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install

# Configuration des hooks Git
echo "🔧 Configuration des hooks Git..."
if [ -d ".git" ]; then
    echo "📝 Configuration des hooks de pre-commit..."
    npx husky install
    npx husky add .husky/pre-commit "npm run lint && npm run format"
    echo "✅ Hooks Git configurés"
else
    echo "⚠️  Dossier .git non trouvé, initialisation Git..."
    git init
    git add .
    git commit -m "Initial commit: SeniorPhonePro setup"
    echo "✅ Git initialisé"
fi

# Vérification de la configuration
echo "🔍 Vérification de la configuration..."

# Vérifier TypeScript
if [ -f "tsconfig.json" ]; then
    echo "✅ TypeScript configuré"
else
    echo "❌ TypeScript non configuré"
fi

# Vérifier ESLint
if [ -f ".eslintrc.js" ]; then
    echo "✅ ESLint configuré"
else
    echo "❌ ESLint non configuré"
fi

# Vérifier Prettier
if [ -f ".prettierrc" ]; then
    echo "✅ Prettier configuré"
else
    echo "❌ Prettier non configuré"
fi

echo ""
echo "🎉 Configuration terminée avec succès !"
echo ""
echo "📱 Pour démarrer l'application :"
echo "   npm start"
echo ""
echo "🔧 Scripts disponibles :"
echo "   npm run android    # Lancer sur Android"
echo "   npm run ios        # Lancer sur iOS"
echo "   npm run web        # Lancer sur le web"
echo "   npm run lint       # Vérifier le code"
echo "   npm run format     # Formater le code"
echo ""
echo "📚 Documentation :"
echo "   - USER_GUIDE.md    # Guide utilisateur"
echo "   - DEVELOPER_README.md # Guide développeur"
echo ""
echo "🚀 SeniorPhonePro est prêt à être utilisé !"
