# 📋 Briefing Claude CLI - Projet SeniorPhonePro

## 🎯 Vue d'ensemble
**SeniorPhonePro** est une application React Native optimisée pour les seniors, avec interface accessible et synthèse vocale.

## 🏗️ Architecture technique
- **Framework** : React Native avec Expo
- **Langage** : TypeScript
- **Node.js** : v24.6.0
- **React** : 19.0.0
- **Expo** : 53.0.22

## 📱 Structure des écrans

### 1. Navigation (Écran principal)
- Boutons : Contacts, Téléphone, Créer contact
- Informations système : Réseau, batterie
- Design senior-friendly

### 2. Contacts
- Liste des contacts avec photos
- Recherche et filtrage
- Navigation vers appel/création

### 3. Phone (Composition)
- **DialPad** : Pavé 4x3, bordures noires
- **PhoneDisplay** : Affichage numéro, bordure noire
- **Zoom numéro** : Modal + synthèse vocale
- **Bouton Appeler** : Déclenche confirmation

### 4. CreateContact
- Formulaire avec validation
- Clavier virtuel personnalisé
- Sauvegarde contacts

### 5. CallScreen
- Affichage contact sélectionné
- Boutons "Appeler"/"Annuler"
- Modal confirmation + synthèse vocale

## 🔊 Synthèse vocale
- **Configuration** : `rate: 0.8`, `language: 'fr-FR'`
- **PhoneDisplay** : "Numéro composé : [numéro]"
- **App.tsx** : "Voulez-vous appeler [numéro] ? Si oui, appuyez sur le bouton vert. Sinon, appuyez sur le bouton rouge."

## 🎨 Design
- **Couleurs** : Vert (#4CAF50), Rouge (#F44336), Bleu (#2196F3)
- **Bordures** : Noires sur DialPad et PhoneDisplay
- **Responsive** : Adaptatif selon écran
- **Accessibilité** : Boutons larges, textes lisibles

## 🧹 Nettoyage récent (Code mort supprimé)
**De PhoneDisplay.tsx :**
- État `showCallConfirmZoom` (jamais utilisé)
- Fonction `speakCallConfirmation` (jamais appelée)
- Variables animation `callConfirmScale`, `callConfirmOpacity`
- Fonctions `closeCallConfirmZoom`, `confirmCall`, `cancelCall`
- Modal confirmation complet + styles `zoomCallConfirm*`

**Raison** : Logique confirmation centralisée dans App.tsx

## 📊 Modal confirmation (App.tsx)
**Répartition sections :**
- Titre : 10% (icône 📞 + titre)
- Numéro : 20% (48-72px, très visible)
- Question : 10% ("Voulez-vous lancer cet appel ?")
- Synthèse vocale : 15% (bouton "🔊 Relire les instructions")
- Boutons : 30% ("Non" rouge + "Oui" vert)
- Instructions : 15% (fermeture)

## 🔧 Configuration technique
- **Node.js** : Options pour éviter erreurs TypeScript
- **React** : Compatible avec react-native-renderer
- **Dépendances** : expo-speech, expo-contacts, expo-battery

## 🚀 État actuel
- ✅ Application fonctionnelle
- ✅ Code nettoyé et optimisé
- ✅ Synthèse vocale opérationnelle
- ✅ Interface responsive
- ✅ Design senior-friendly

## 📝 Notes importantes
- Modal confirmation dans App.tsx fonctionne parfaitement
- Zoom numéro dans PhoneDisplay.tsx fonctionne parfaitement
- Logique confirmation centralisée dans App.tsx
- Code mort éliminé pour performances

## 🎯 Fonctionnalités clés
1. **Composition numéro** : DialPad + PhoneDisplay
2. **Zoom numéro** : Modal avec synthèse vocale
3. **Confirmation appel** : Modal avec voix automatique
4. **Gestion contacts** : Liste + création
5. **Accessibilité** : Design senior-friendly

## 🔄 Historique des modifications
- Ajout synthèse vocale dans modal confirmation
- Optimisation répartition sections (10%+20%+10%+15%+30%+15%)
- Agrandissement numéro téléphone (48-72px)
- Nettoyage code mort (150 lignes supprimées)
- Configuration voix à 80% de vitesse
- Ajout bouton "🔊 Relire les instructions"

---
**Claude CLI peut maintenant comprendre le projet et son contexte !**
