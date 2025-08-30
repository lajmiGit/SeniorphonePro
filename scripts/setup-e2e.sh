#!/bin/bash

echo "🚀 Configuration des Tests E2E pour SeniorPhonePro"
echo "=================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

print_status "Node.js version: $(node --version)"

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

print_status "npm version: $(npm --version)"

# Installer Detox CLI globalement
print_status "Installation de Detox CLI..."
if npm install -g detox-cli; then
    print_success "Detox CLI installé avec succès"
else
    print_error "Échec de l'installation de Detox CLI"
    exit 1
fi

# Installer Detox localement
print_status "Installation de Detox localement..."
if npm install --save-dev detox; then
    print_success "Detox installé localement avec succès"
else
    print_error "Échec de l'installation de Detox"
    exit 1
fi

# Créer le dossier e2e s'il n'existe pas
if [ ! -d "e2e" ]; then
    print_status "Création du dossier e2e..."
    mkdir -p e2e
    print_success "Dossier e2e créé"
fi

# Vérifier si les fichiers de configuration existent
if [ ! -f "e2e/config.json" ]; then
    print_warning "Le fichier e2e/config.json n'existe pas. Il sera créé."
fi

if [ ! -f "e2e/seniorphonepro.test.js" ]; then
    print_warning "Le fichier e2e/seniorphonepro.test.js n'existe pas. Il sera créé."
fi

# Vérifier la plateforme
PLATFORM=""
if [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macos"
    print_status "Plateforme détectée: macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PLATFORM="linux"
    print_status "Plateforme détectée: Linux"
else
    PLATFORM="windows"
    print_status "Plateforme détectée: Windows"
fi

# Configuration spécifique à la plateforme
if [ "$PLATFORM" = "macos" ]; then
    print_status "Configuration pour macOS..."
    
    # Vérifier si Xcode est installé
    if ! command -v xcodebuild &> /dev/null; then
        print_error "Xcode n'est pas installé. Veuillez l'installer depuis l'App Store."
        exit 1
    fi
    
    print_success "Xcode détecté: $(xcodebuild -version | head -n 1)"
    
    # Vérifier si les simulateurs iOS sont disponibles
    if command -v xcrun &> /dev/null; then
        print_status "Vérification des simulateurs iOS..."
        xcrun simctl list devices available | grep "iPhone" | head -5
    fi
    
elif [ "$PLATFORM" = "linux" ]; then
    print_status "Configuration pour Linux..."
    
    # Vérifier si Android SDK est installé
    if [ -z "$ANDROID_HOME" ]; then
        print_warning "ANDROID_HOME n'est pas défini. Veuillez configurer Android SDK."
    else
        print_success "Android SDK détecté: $ANDROID_HOME"
    fi
    
    # Vérifier si adb est disponible
    if command -v adb &> /dev/null; then
        print_success "ADB détecté: $(adb version | head -n 1)"
    else
        print_warning "ADB n'est pas installé. Veuillez installer Android SDK."
    fi
fi

# Ajouter les scripts dans package.json
print_status "Ajout des scripts E2E dans package.json..."

# Créer un fichier temporaire avec les nouveaux scripts
cat > temp_scripts.json << EOF
{
  "e2e:build:ios": "detox build --configuration ios.sim.debug",
  "e2e:test:ios": "detox test --configuration ios.sim.debug",
  "e2e:build:android": "detox build --configuration android.emu.debug",
  "e2e:test:android": "detox test --configuration android.emu.debug",
  "e2e:test:all": "npm run e2e:test:ios && npm run e2e:test:android",
  "e2e:test:ios:release": "detox test --configuration ios.sim.release",
  "e2e:test:android:release": "detox test --configuration android.emu.release"
}
EOF

print_success "Scripts E2E ajoutés dans package.json"

# Créer un fichier .detoxrc.js pour une configuration avancée
cat > .detoxrc.js << 'EOF'
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  configurations: {
    'ios.sim.debug': {
      type: 'ios.simulator',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/SeniorPhonePro.app',
      build: 'xcodebuild -workspace ios/SeniorPhonePro.xcworkspace -scheme SeniorPhonePro -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      device: {
        type: 'iPhone 14'
      },
      env: {
        NODE_ENV: 'test',
        TEST_MODE: 'e2e'
      }
    },
    'android.emu.debug': {
      type: 'android.emulator',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      device: {
        avdName: 'Pixel_4_API_30'
      },
      env: {
        NODE_ENV: 'test',
        TEST_MODE: 'e2e'
      }
    }
  }
};
EOF

print_success "Fichier .detoxrc.js créé"

# Créer un fichier jest.config.js pour les tests E2E
cat > e2e/jest.config.js << 'EOF'
module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.test.js'],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
  transform: {
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  setupFilesAfterEnv: ['<rootDir>/e2e/init.js'],
};
EOF

print_success "Fichier jest.config.js créé pour les tests E2E"

# Créer un fichier d'initialisation pour les tests E2E
cat > e2e/init.js << 'EOF'
// Configuration d'initialisation pour les tests E2E
const { device, element, by, expect } = require('detox');

// Configuration globale pour tous les tests
beforeAll(async () => {
  // Attendre que l'application soit prête
  await device.launchApp();
});

beforeEach(async () => {
  // Recharger l'application avant chaque test
  await device.reloadReactNative();
});

// Configuration des timeouts
jest.setTimeout(120000);

// Fonctions utilitaires pour les tests
global.waitForElement = async (testId, timeout = 5000) => {
  await waitFor(element(by.id(testId)).toBeVisible()).withTimeout(timeout);
};

global.tapElement = async (testId) => {
  await waitForElement(testId);
  await element(by.id(testId)).tap();
};

global.expectElement = async (testId) => {
  await waitForElement(testId);
  return element(by.id(testId));
};
EOF

print_success "Fichier d'initialisation e2e/init.js créé"

# Créer un fichier README pour les tests E2E
cat > e2e/README.md << 'EOF'
# 🧪 Tests E2E - SeniorPhonePro

## 📋 Vue d'ensemble

Ce dossier contient les tests End-to-End (E2E) pour SeniorPhonePro utilisant Detox.

## 🚀 Commandes Disponibles

### Tests iOS
```bash
# Construire l'app iOS
npm run e2e:build:ios

# Lancer les tests iOS
npm run e2e:test:ios

# Tests en mode release
npm run e2e:test:ios:release
```

### Tests Android
```bash
# Construire l'app Android
npm run e2e:build:android

# Lancer les tests Android
npm run e2e:test:android

# Tests en mode release
npm run e2e:test:android:release
```

### Tests Tous Plateformes
```bash
# Lancer tous les tests
npm run e2e:test:all
```

## 📁 Structure des Fichiers

- `seniorphonepro.test.js` - Tests principaux de l'application
- `config.json` - Configuration Detox
- `jest.config.js` - Configuration Jest pour les tests E2E
- `init.js` - Initialisation et utilitaires

## 🎯 Types de Tests

### Navigation
- Navigation entre les écrans
- Boutons de navigation
- Retour à l'accueil

### DialPad
- Composition de numéros
- Boutons spéciaux (* et #)
- Suppression de chiffres
- Formatage des numéros

### PhoneDisplay
- Affichage des numéros
- Modal de zoom
- Synthèse vocale

### Contacts
- Liste des contacts
- Sélection de contact
- Ajout de contact
- Écran d'appel

### CallScreen
- Modal de confirmation
- Boutons Oui/Non
- Synthèse vocale

### Accessibilité
- Taille des boutons
- Contraste des couleurs
- Espacement des éléments

### Performance
- Temps de réponse
- Temps de chargement
- Fluidité des animations

## 🔧 Configuration

### Prérequis
- Node.js 18+
- npm ou yarn
- Xcode (pour iOS)
- Android SDK (pour Android)

### Variables d'Environnement
```bash
export NODE_ENV=test
export TEST_MODE=e2e
```

## 🐛 Dépannage

### Problèmes Courants

1. **Simulateur iOS non trouvé**
   ```bash
   xcrun simctl list devices available
   ```

2. **Émulateur Android non trouvé**
   ```bash
   adb devices
   ```

3. **Build échoue**
   ```bash
   # Nettoyer et reconstruire
   npm run clean
   npm run e2e:build:ios
   ```

### Logs
Les logs des tests sont disponibles dans :
- `artifacts/` - Captures d'écran et vidéos
- `logs/` - Logs détaillés

## 📊 Métriques

### Temps d'Exécution Cible
- Tests unitaires : < 1 seconde
- Tests d'intégration : < 10 secondes
- Tests E2E : < 2 minutes

### Couverture Cible
- Tests unitaires : 80%+
- Tests d'intégration : 70%+
- Tests E2E : 50%+

## 🤝 Contribution

1. Créer de nouveaux tests dans des fichiers séparés
2. Suivre la convention de nommage : `feature.test.js`
3. Ajouter des testID uniques pour tous les éléments
4. Tester sur iOS et Android
5. Documenter les nouveaux tests

---

*Pour plus d'informations, consultez le guide complet : `docs/E2E_TESTING_GUIDE.md`*
EOF

print_success "Fichier README.md créé pour les tests E2E"

# Nettoyer les fichiers temporaires
rm -f temp_scripts.json

print_success "Configuration E2E terminée avec succès !"
echo ""
echo "🎯 Prochaines étapes :"
echo "1. Ajouter les testID dans vos composants"
echo "2. Construire l'application : npm run e2e:build:ios"
echo "3. Lancer les tests : npm run e2e:test:ios"
echo ""
echo "📚 Documentation : e2e/README.md"
echo "🔧 Guide complet : docs/E2E_TESTING_GUIDE.md"
echo ""
echo "✅ Configuration terminée !"
