# 📱 SeniorPhonePro

**Application mobile spécialement conçue pour les seniors avec une interface intuitive et accessible**

[![Tests](https://img.shields.io/badge/Tests-75%25%20passing-brightgreen)](https://github.com/your-username/SeniorPhonePro)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76.0-61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2053-000000)](https://expo.dev/)

## 🎯 **Vue d'ensemble**

SeniorPhonePro est une application mobile React Native conçue spécifiquement pour les utilisateurs seniors, offrant une expérience téléphonique simplifiée et accessible. L'application combine des fonctionnalités téléphoniques traditionnelles avec des innovations modernes adaptées aux besoins des seniors.

## ✨ **Fonctionnalités principales**

### 📞 **Téléphone intelligent**
- **Composeur numérique** avec boutons surdimensionnés et contrastes élevés
- **Affichage du numéro** avec formatage automatique et zoom modal
- **Bouton d'appel** avec effet 3D et retour haptique
- **Gestion des appels** avec confirmation et intégration native

### 👥 **Gestion des contacts**
- **Liste des contacts** avec photos et informations détaillées
- **Création de contacts** avec formulaire simplifié et validation
- **Recherche et navigation** intuitive entre les contacts
- **Intégration native** avec le répertoire du téléphone

### ⌨️ **Clavier virtuel intelligent**
- **Trois modes de saisie** : Caractères (A-Z), Chiffres (0-9), Caractères spéciaux (@#$)
- **Adaptation automatique** : Mode numérique pour les numéros de téléphone
- **Zoom modal** avec synthèse vocale et bouton de réécoute
- **Taille de police dynamique** qui s'adapte au contenu

### 🎨 **Interface adaptée aux seniors**
- **Couleurs optimisées** selon les recommandations scientifiques pour la vision des seniors
- **Typographie surdimensionnée** avec contraste élevé
- **Effets 3D subtils** pour une meilleure perception de la profondeur
- **Navigation simplifiée** avec bouton d'accueil omniprésent

### 🔧 **Fonctionnalités avancées**
- **Zoom modaux** pour les informations système (réseau, batterie, heure)
- **Synthèse vocale** pour la lecture des informations importantes
- **Retour haptique** pour une meilleure interaction tactile
- **Responsive design** adaptatif à toutes les tailles d'écran

## 🚀 **Installation et démarrage**

### **Prérequis**
- Node.js 18+ 
- npm ou yarn
- Expo CLI
- Expo Go (application mobile)

### **Installation**
```bash
# Cloner le projet
git clone https://github.com/your-username/SeniorPhonePro.git
cd SeniorPhonePro

# Installer les dépendances
npm install

# Démarrer l'application
npx expo start
```

### **Utilisation**
1. Scannez le QR code avec Expo Go
2. L'application se charge automatiquement
3. Naviguez entre les écrans avec les boutons dédiés
4. Utilisez le bouton d'accueil pour revenir au menu principal

## 🏗️ **Architecture technique**

### **Technologies utilisées**
- **React Native 0.76.0** - Framework mobile cross-platform
- **TypeScript 5.9.2** - Typage statique et sécurité du code
- **Expo SDK 53** - Outils de développement et services
- **React 19.1.1** - Bibliothèque UI moderne

### **Structure du projet**
```
SeniorPhonePro/
├── components/           # Composants React Native
│   ├── VirtualKeyboard.tsx    # Clavier virtuel intelligent
│   ├── CreateContactScreen.tsx # Écran de création de contact
│   ├── CallScreen.tsx         # Écran d'appel
│   ├── ContactList.tsx        # Liste des contacts
│   ├── NavigationScreen.tsx   # Navigation principale
│   ├── PhoneDisplay.tsx       # Affichage du numéro
│   ├── DialPad.tsx           # Clavier numérique
│   └── SystemInfo.tsx        # Informations système
├── constants/            # Constantes et configurations
├── __tests__/           # Tests unitaires complets
├── docs/                # Documentation utilisateur
└── scripts/             # Scripts d'automatisation
```

### **Fonctionnalités techniques**
- **Lazy Loading** pour optimiser les performances
- **Tests unitaires** avec Jest et React Native Testing Library
- **Linting et formatage** avec ESLint et Prettier
- **Configuration Babel** optimisée pour React Native Reanimated
- **Gestion d'état** avec React Hooks

## 🧪 **Tests et qualité**

### **Couverture des tests**
- **75% des tests passent** avec une configuration optimisée
- **Tests complets** pour tous les composants principaux
- **Mocks appropriés** pour les modules Expo et React Native
- **Tests d'accessibilité** et de cas limites

### **Exécution des tests**
```bash
# Lancer tous les tests
npm test

# Lancer les tests avec couverture
npm run test:coverage

# Lancer les tests en mode watch
npm run test:watch
```

## 📱 **Compatibilité**

### **Plateformes supportées**
- ✅ **Android** 8.0+ (API 26+)
- ✅ **iOS** 12.0+
- ✅ **Expo Go** (développement et test)

### **Appareils recommandés**
- **Taille d'écran** : 5" minimum (recommandé 6"+)
- **Résolution** : 720p minimum (recommandé 1080p+)
- **RAM** : 2GB minimum (recommandé 4GB+)

## 🎨 **Design et accessibilité**

### **Principes de design**
- **Contraste élevé** pour une meilleure lisibilité
- **Tailles de police** adaptées à la vision des seniors
- **Espacement généreux** entre les éléments interactifs
- **Couleurs optimisées** selon les recommandations scientifiques

### **Fonctionnalités d'accessibilité**
- **Support VoiceOver/TalkBack** complet
- **Navigation au clavier** et par gestes
- **Labels et descriptions** pour tous les éléments
- **TestID** pour les tests automatisés

## 🔧 **Configuration et personnalisation**

### **Variables d'environnement**
```bash
# Créer un fichier .env.local
EXPO_PUBLIC_APP_NAME=SeniorPhonePro
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### **Personnalisation des couleurs**
Modifiez `constants/Colors.ts` pour adapter la palette de couleurs :
```typescript
export const Colors = {
  primary: '#4CAF50',      // Couleur principale
  secondary: '#2196F3',    // Couleur secondaire
  background: '#FFFFFF',    // Arrière-plan
  text: '#212121',         // Texte principal
  // ... autres couleurs
};
```

## 📚 **Documentation**

### **Guides disponibles**
- **[Guide utilisateur](docs/USER_GUIDE.md)** - Instructions détaillées pour les utilisateurs finaux
- **[Guide développeur](DEVELOPER_README.md)** - Documentation technique pour les développeurs
- **[Changelog](CHANGELOG.md)** - Historique des versions et modifications

### **API et composants**
Chaque composant est documenté avec JSDoc et dispose de tests unitaires complets. Consultez les fichiers source pour plus de détails.

## 🤝 **Contribution**

### **Comment contribuer**
1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

### **Standards de code**
- **TypeScript strict** obligatoire
- **Tests unitaires** pour toutes les nouvelles fonctionnalités
- **Linting ESLint** avec règles strictes
- **Formatage Prettier** automatique

## 📄 **Licence**

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 **Remerciements**

- **Communauté React Native** pour le framework exceptionnel
- **Équipe Expo** pour les outils de développement
- **Utilisateurs seniors** pour leurs retours et suggestions
- **Contributeurs** qui ont participé au développement

## 📞 **Support et contact**

- **Issues GitHub** : [Signaler un bug](https://github.com/your-username/SeniorPhonePro/issues)
- **Discussions** : [Forum communautaire](https://github.com/your-username/SeniorPhonePro/discussions)
- **Email** : support@seniorphonepro.com

---

**Développé avec ❤️ pour améliorer l'expérience mobile des seniors**

*Dernière mise à jour : Décembre 2024*
