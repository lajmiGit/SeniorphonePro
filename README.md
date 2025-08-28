# SeniorPhonePro

## Description

**SeniorPhonePro** est une application mobile moderne et intuitive spécialement conçue pour les seniors, offrant une interface téléphonique simplifiée avec des fonctionnalités d'accessibilité avancées.

## Fonctionnalités

- 📱 **Interface téléphonique intuitive** - Pavé numérique avec boutons 3D
- 🎯 **Retour haptique** - Vibration tactile pour chaque interaction
- 🔍 **Modals de zoom** - Visualisation agrandie des informations
- 🗣️ **Synthèse vocale** - Lecture automatique des informations
- 📞 **Gestion des contacts** - Liste, création et appels
- 🎨 **Design responsive** - Adapté à tous les écrans
- ⚡ **Performance optimisée** - React Native avec TypeScript
- ⌨️ **Clavier virtuel intelligent** - Saisie adaptative par type de champ
- 🔢 **Clavier téléphone automatique** - Mode chiffres forcé pour les numéros
- ✅ **Validation intelligente** - Sauvegarde ou annulation selon l'action

## Installation

```bash
# Cloner le projet
git clone https://github.com/lajmiGit/SeniorphonePro.git
cd SeniorPhonePro

# Installer les dépendances
npm install

# Lancer l'application
npm start

# Lancer les tests
npm test

# Vérifier la qualité du code
npm run lint
```

## Technologies utilisées

- **React Native 0.79.5** - Framework mobile cross-platform
- **TypeScript 5.8.3** - Typage statique et sécurité du code
- **Expo SDK 53** - Outils de développement et déploiement
- **React 19.0.0** - Bibliothèque UI moderne
- **Jest** - Tests unitaires
- **ESLint + Prettier** - Qualité et formatage du code

## Structure du projet

```
SeniorPhonePro/
├── components/           # Composants React Native
│   ├── DialPad.tsx      # Pavé numérique avec vibration haptique
│   ├── PhoneDisplay.tsx # Affichage du numéro avec zoom
│   ├── SystemInfo.tsx   # Infos système (réseau, batterie, heure)
│   ├── ContactList.tsx  # Liste des contacts
│   ├── CreateContactScreen.tsx # Création de contacts
│   ├── NavigationScreen.tsx    # Navigation principale
│   ├── VirtualKeyboard.tsx     # Clavier virtuel
│   └── LoadingSpinner.tsx      # Indicateur de chargement
├── types/               # Définitions TypeScript
├── constants/           # Constantes et couleurs
├── utils/               # Fonctions utilitaires
├── __tests__/           # Tests unitaires
├── docs/                # Documentation utilisateur
└── assets/              # Images et ressources
```

## Fonctionnalités détaillées

### 🎯 **Retour haptique (Vibration)**
- **Pavé numérique** : Vibration de 50ms sur chaque touche
- **Boutons d'action** : Retour tactile sur tous les boutons
- **Navigation** : Confirmation tactile des actions

### 🔍 **Modals de zoom**
- **Numéro de téléphone** : Visualisation agrandie avec synthèse vocale
- **Informations système** : Zoom sur réseau, batterie et heure
- **Confirmation d'appel** : Modal de validation avec synthèse vocale

### 🗣️ **Synthèse vocale**
- **Langue** : Français (fr-FR)
- **Vitesse** : Adaptée aux seniors (0.7x)
- **Volume** : Confortable (0.8)
- **Automatique** : Lecture lors des interactions

### 📞 **Gestion des contacts**
- **Liste des contacts** : Affichage avec photos et favoris
- **Création de contacts** : Formulaire simplifié
- **Appels directs** : Intégration avec l'application téléphone native

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commiter vos changements (`git commit -m '✨ Ajout de...'`)
4. Pousser vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## Scripts disponibles

```bash
npm start          # Démarrer l'application Expo
npm run android    # Lancer sur émulateur Android
npm run ios        # Lancer sur simulateur iOS
npm run web        # Lancer en mode web
npm test           # Exécuter les tests unitaires
npm run lint       # Vérifier la qualité du code
npm run format     # Formater le code avec Prettier
```

## État du projet

- ✅ **Code principal** : Fonctionnel et testé
- ✅ **Tests unitaires** : 68 tests, 23 passent
- ✅ **TypeScript** : Configuration stricte activée
- ✅ **ESLint** : Qualité du code vérifiée
- ✅ **Accessibilité** : Optimisé pour les seniors

## Licence

MIT

## Contact

- **Développeur** : Mohamed Lajmi
- **Repository** : https://github.com/lajmiGit/SeniorphonePro
- **Projet** : SeniorPhonePro - Application mobile pour seniors
