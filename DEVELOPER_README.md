# SeniorPhonePro - Guide Développeur

## 🏗️ Architecture du Projet

L'application SeniorPhonePro est construite avec React Native et Expo, optimisée pour les seniors avec une interface simple et accessible.

### Structure des Dossiers

```
SeniorPhonePro/
├── components/           # Composants réutilisables
│   ├── DialPad.tsx      # Pavé numérique
│   ├── PhoneDisplay.tsx # Affichage du numéro
│   └── SystemInfo.tsx   # Informations système
├── constants/            # Constantes et configuration
│   ├── Colors.ts        # Palette de couleurs
│   └── Accessibility.ts # Configuration accessibilité
├── docs/                # Documentation
│   └── USER_GUIDE.md    # Guide utilisateur
├── assets/              # Images et ressources
├── App.tsx              # Composant principal
├── app.json             # Configuration Expo
└── package.json         # Dépendances
```

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- npm ou yarn
- Expo CLI
- Android Studio (pour Android) ou Xcode (pour iOS)

### Installation

```bash
# Cloner le projet
git clone [url-du-repo]
cd SeniorPhonePro

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

### Scripts Disponibles

- `npm start` - Démarrer le serveur de développement
- `npm run android` - Lancer sur Android
- `npm run ios` - Lancer sur iOS
- `npm run web` - Lancer sur le web
- `npm run build` - Construire l'application

## 🎨 Design System

### Palette de Couleurs

- **Accueil** : `#4CAF50` (Vert)
- **Informations** : `#2196F3` (Bleu)
- **Téléphone** : `#FF9800` (Orange)
- **Pavé Numérique** : `#9C27B0` (Violet)
- **Appel** : `#F44336` (Rouge)

### Typographie

- **Petite** : 12px (pour les labels)
- **Moyenne** : 14-16px (pour le texte standard)
- **Grande** : 18-22px (pour les boutons)
- **Très Grande** : 28px (pour le pavé numérique)

### Espacements

- **Section** : 10px horizontal, 2px vertical
- **Padding** : 12px
- **Bordure** : 12px de rayon

## 🔧 Composants

### DialPad

Pavé numérique 4x3 avec gestion des événements tactiles.

**Props :**

- `onNumberPress: (num: string) => void`

**Fonctionnalités :**

- Boutons responsifs
- Feedback haptique
- Espacement optimal

### PhoneDisplay

Affichage du numéro composé avec bouton de suppression.

**Props :**

- `phoneNumber: string`
- `onClear: () => void`

**Fonctionnalités :**

- Formatage automatique
- Limite de 15 chiffres
- Bouton d'effacement

### SystemInfo

Affichage des informations système (réseau, batterie, heure).

**Props :**

- `networkLevel?: number` (1-4)
- `batteryLevel?: number` (0-100)

**Fonctionnalités :**

- Mise à jour en temps réel
- Indicateurs visuels colorés
- Heure locale

## ♿ Accessibilité

### Configuration

- **Vibrations haptiques** activées par défaut
- **Contraste élevé** pour une meilleure visibilité
- **Boutons surdimensionnés** (44px minimum)
- **Police grande** pour la lisibilité

### Fonctionnalités Spéciales

- Support daltonisme
- Mode nuit automatique
- Ajustement de la taille de police
- Compatible appareils auditifs

## 📱 Responsive Design

### Breakpoints

- **Mobile** : < 768px (portrait)
- **Tablette** : 768px - 1024px
- **Desktop** : > 1024px

### Adaptation

- Hauteurs proportionnelles basées sur `Dimensions.get('window')`
- Espacements adaptatifs
- Boutons redimensionnés automatiquement

## 🧪 Tests

### Tests Unitaires

```bash
npm test
```

### Tests d'Intégration

- Vérification des composants
- Test des interactions utilisateur
- Validation de l'accessibilité

## 📦 Build et Déploiement

### Expo Build

```bash
# Android
expo build:android

# iOS
expo build:ios
```

### Configuration

- `app.json` : Configuration Expo
- `package.json` : Dépendances et scripts
- `tsconfig.json` : Configuration TypeScript

## 🔍 Débogage

### Outils Recommandés

- React Native Debugger
- Flipper
- Chrome DevTools (pour le web)

### Logs

- Console.log pour le développement
- Vibration haptique pour le feedback
- Alertes pour les confirmations

## 📚 Ressources

### Documentation

- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Bonnes Pratiques

- Composants réutilisables
- Gestion d'état locale
- Performance optimisée
- Code lisible et maintenable

## 🤝 Contribution

### Workflow

1. Fork du projet
2. Création d'une branche feature
3. Développement et tests
4. Pull Request avec description détaillée

### Standards de Code

- TypeScript strict
- ESLint configuration
- Prettier pour le formatage
- Tests unitaires requis

## 📞 Support

Pour toute question technique :

- Issues GitHub
- Documentation du code
- Code review obligatoire

---

_SeniorPhonePro - Code accessible et maintenable_ 🚀
