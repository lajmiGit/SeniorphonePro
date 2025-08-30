# 🚀 Comment Lancer les Tests d'Interface - SeniorPhonePro

## 📋 **Résumé Rapide**

| Type de Test | Commande | Description |
|-------------|----------|-------------|
| **Unitaires** | `./scripts/run-tests.sh unit` | Tests rapides des composants |
| **E2E iOS** | `./scripts/run-tests.sh e2e:ios` | Tests sur simulateur iOS |
| **E2E Android** | `./scripts/run-tests.sh e2e:android` | Tests sur émulateur Android |
| **Tous** | `./scripts/run-tests.sh all` | Tous les tests |

## 🎯 **Tests Unitaires (Déjà fonctionnels)**

### ✅ **Lancer les tests unitaires**
```bash
# Méthode simple
./scripts/run-tests.sh unit

# Ou directement avec npm
npm test
```

### 🔄 **Mode watch (redémarrage automatique)**
```bash
./scripts/run-tests.sh unit:watch
```

### 📊 **Avec couverture de code**
```bash
./scripts/run-tests.sh unit:coverage
```

## 🚀 **Tests E2E avec Detox**

### 1️⃣ **Installation automatique**
```bash
# Installer et configurer Detox
./scripts/run-tests.sh e2e:setup
```

### 2️⃣ **Tests iOS**
```bash
# Lancer les tests E2E sur iOS
./scripts/run-tests.sh e2e:ios
```

**Prérequis iOS :**
- Xcode installé
- Simulateur iOS disponible
- iPhone 14 ou plus récent

### 3️⃣ **Tests Android**
```bash
# Lancer les tests E2E sur Android
./scripts/run-tests.sh e2e:android
```

**Prérequis Android :**
- Android SDK installé
- Émulateur Android disponible
- Pixel 4 API 30 ou plus récent

### 4️⃣ **Tous les tests E2E**
```bash
# Lancer iOS et Android
./scripts/run-tests.sh e2e:all
```

## 🎨 **Tests Visuels avec Percy**

### 📸 **Lancer les tests visuels**
```bash
./scripts/run-tests.sh visual
```

**Prérequis :**
- Compte Percy (gratuit)
- Token Percy configuré

## 🎯 **Tests Complets**

### 🌟 **Tous les tests d'un coup**
```bash
./scripts/run-tests.sh all
```

Cette commande lance :
1. Tests unitaires
2. Tests E2E iOS
3. Tests E2E Android
4. Tests visuels

## 📱 **Tests Spécifiques pour Seniors**

### 🔍 **Tests d'accessibilité**
```bash
# Tests unitaires d'accessibilité
npm test -- --testNamePattern="accessibilité"

# Tests E2E d'accessibilité
npm run e2e:test:ios -- --testNamePattern="Accessibilité"
```

### ⚡ **Tests de performance**
```bash
# Tests de performance
npm test -- --testNamePattern="performance"

# Tests E2E de performance
npm run e2e:test:ios -- --testNamePattern="Performance"
```

## 🛠️ **Commandes Manuelles (Alternative)**

### Tests Unitaires
```bash
# Tous les tests
npm test

# Tests spécifiques
npm test -- --testNamePattern="DialPad"

# Mode watch
npm test -- --watch

# Avec couverture
npm test -- --coverage
```

### Tests E2E Detox
```bash
# Construire iOS
npm run e2e:build:ios

# Tester iOS
npm run e2e:test:ios

# Construire Android
npm run e2e:build:android

# Tester Android
npm run e2e:test:android
```

### Tests Visuels Percy
```bash
# Installer Percy
npm install --save-dev @percy/cli @percy/react-native

# Lancer les tests
npm run percy:test
```

## 🔧 **Dépannage**

### ❌ **Erreur "Detox non trouvé"**
```bash
# Réinstaller Detox
./scripts/run-tests.sh e2e:setup
```

### ❌ **Erreur "Simulateur iOS non trouvé"**
```bash
# Lister les simulateurs disponibles
xcrun simctl list devices available

# Démarrer un simulateur
xcrun simctl boot "iPhone 14"
```

### ❌ **Erreur "Émulateur Android non trouvé"**
```bash
# Lister les émulateurs
emulator -list-avds

# Démarrer un émulateur
emulator -avd Pixel_4_API_30
```

### ❌ **Erreur "Build échoue"**
```bash
# Nettoyer et reconstruire
npm run clean
rm -rf ios/build android/app/build
./scripts/run-tests.sh e2e:ios
```

## 📊 **Résultats et Rapports**

### 📈 **Rapport de couverture**
```bash
# Générer le rapport
./scripts/run-tests.sh unit:coverage

# Ouvrir le rapport
open coverage/lcov-report/index.html
```

### 📋 **Rapport HTML des tests**
```bash
# Générer le rapport HTML
npm test -- --json --outputFile=test-results.json

# Ouvrir le rapport
open test-report-ultra-detailed.html
```

## 🎯 **Scénarios d'Usage**

### 💻 **Développement quotidien**
```bash
# Tests rapides pendant le développement
./scripts/run-tests.sh unit:watch
```

### 🔄 **Avant commit**
```bash
# Tests complets avant de commiter
./scripts/run-tests.sh unit
```

### 🚀 **Avant release**
```bash
# Tests complets incluant E2E
./scripts/run-tests.sh all
```

### 🐛 **Tests de régression**
```bash
# Tests E2E complets
./scripts/run-tests.sh e2e:all
```

## 📱 **Tests Spécifiques par Composant**

### DialPad
```bash
# Tests unitaires DialPad
npm test -- --testNamePattern="DialPad"

# Tests E2E DialPad
npm run e2e:test:ios -- --testNamePattern="DialPad"
```

### PhoneDisplay
```bash
# Tests unitaires PhoneDisplay
npm test -- --testNamePattern="PhoneDisplay"

# Tests E2E PhoneDisplay
npm run e2e:test:ios -- --testNamePattern="PhoneDisplay"
```

### Contacts
```bash
# Tests unitaires Contacts
npm test -- --testNamePattern="ContactList"

# Tests E2E Contacts
npm run e2e:test:ios -- --testNamePattern="Contacts"
```

## 🎯 **Conseils pour les Seniors**

### ✅ **Tests prioritaires**
1. **Tests unitaires** - Rapides et fiables
2. **Tests E2E iOS** - Simulateur facile à utiliser
3. **Tests d'accessibilité** - Spécifiques aux seniors

### ⚡ **Optimisation du temps**
```bash
# Tests rapides seulement
./scripts/run-tests.sh unit

# Tests complets une fois par jour
./scripts/run-tests.sh all
```

### 🔍 **Débogage**
```bash
# Tests avec plus de détails
npm test -- --verbose

# Tests E2E avec logs
npm run e2e:test:ios -- --loglevel trace
```

---

## 🎉 **Résumé**

**Pour commencer rapidement :**
```bash
# 1. Tests unitaires (recommandé pour débuter)
./scripts/run-tests.sh unit

# 2. Tests E2E iOS (quand vous êtes prêt)
./scripts/run-tests.sh e2e:ios

# 3. Tous les tests (avant release)
./scripts/run-tests.sh all
```

**Aide disponible :**
```bash
./scripts/run-tests.sh help
```

---

*Ce guide vous permet de lancer facilement tous les types de tests d'interface pour SeniorPhonePro ! 🚀*
