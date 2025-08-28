# Guide JSDoc - SeniorPhonePro

## 📚 Vue d'ensemble

Ce guide explique comment utiliser et maintenir la documentation JSDoc dans le projet SeniorPhonePro.

## 🎯 Qu'est-ce que JSDoc ?

JSDoc est un standard de documentation qui permet de documenter le code JavaScript/TypeScript directement dans les fichiers source. Il génère automatiquement une documentation complète et à jour.

## 📝 Format de base

### Documentation des composants

````typescript
/**
 * Composant SystemInfo - Affiche les informations système avec zooms interactifs
 *
 * @component
 * @param {SystemInfoProps} props - Propriétés du composant
 * @returns {JSX.Element} Composant SystemInfo rendu
 *
 * @example
 * ```tsx
 * <SystemInfo networkLevel={3} batteryLevel={75} />
 * ```
 *
 * @features
 * - Affichage temps réel de l'heure
 * - Indicateurs visuels 3D
 * - Modals de zoom interactifs
 */
export const SystemInfo: React.FC<SystemInfoProps> = ({ ... }) => {
````

### Documentation des interfaces

```typescript
/**
 * Interface des propriétés du composant SystemInfo
 * @interface SystemInfoProps
 * @property {number} [networkLevel] - Niveau de signal réseau (0-5, défaut: 4)
 * @property {number} [batteryLevel] - Niveau de batterie (0-100, défaut: 85)
 */
interface SystemInfoProps {
  networkLevel?: number;
  batteryLevel?: number;
}
```

### Documentation des fonctions

```typescript
/**
 * Détermine la couleur appropriée pour le niveau de batterie
 * @function getBatteryColor
 * @param {number} level - Niveau de batterie (0-100)
 * @returns {string} Code couleur hexadécimal
 *
 * @example
 * const color = getBatteryColor(75); // Retourne '#4CAF50'
 *
 * @colorMapping
 * - >50%: Vert (#4CAF50)
 * - 21-50%: Orange (#FF9800)
 * - 0-20%: Rouge (#F44336)
 */
const getBatteryColor = (level: number) => {
  // ... logique de la fonction
};
```

## 🏷️ Tags JSDoc courants

### Tags de base

- `@component` - Indique un composant React
- `@param` - Documente un paramètre de fonction
- `@returns` - Documente la valeur de retour
- `@example` - Fournit un exemple d'utilisation
- `@interface` - Documente une interface TypeScript

### Tags avancés

- `@features` - Liste les fonctionnalités principales
- `@colorMapping` - Documente les mappings de couleurs
- `@description` - Description détaillée
- `@since` - Version d'introduction
- `@deprecated` - Indique une fonctionnalité obsolète

## 📖 Exemples concrets

### Composant avec props complexes

````typescript
/**
 * Composant DialPad - Pavé numérique tactile avec retour sonore
 *
 * @component
 * @param {DialPadProps} props - Propriétés du composant
 * @returns {JSX.Element} Composant DialPad rendu
 *
 * @example
 * ```tsx
 * <DialPad onNumberPress={(num) => {
 *   console.log('Numéro pressé:', num);
 *   // Logique de composition du numéro
 * }} />
 * ```
 *
 * @features
 * - Boutons numériques 0-9 avec symboles * et #
 * - Retour sonore lors de la pression
 * - Effets visuels 3D avec ombres et bordures
 * - Taille de police adaptative selon l'écran
 * - Interface responsive et accessible
 * - Optimisé pour l'usage tactile
 *
 * @accessibility
 * - Boutons avec testID uniques pour les tests
 * - Retour sonore pour confirmer la pression
 * - Contrastes élevés pour la lisibilité
 * - Taille des boutons adaptée aux seniors
 */
````

### Fonction utilitaire

```typescript
/**
 * Formate un numéro de téléphone pour l'affichage
 * @function formatPhoneNumber
 * @param {string} number - Numéro de téléphone brut
 * @returns {string} Numéro formaté avec espaces
 *
 * @example
 * formatPhoneNumber('0123456789') // Retourne '01 23 45 67 89'
 * formatPhoneNumber('012345678901234') // Retourne '01 23 45 67 89 01 23 4'
 *
 * @formatting
 * - Ajoute un espace tous les 2 chiffres
 * - Gère les numéros de 1 à 15 chiffres
 * - Préserve les numéros déjà formatés
 *
 * @throws {Error} Si le paramètre n'est pas une chaîne
 */
const formatPhoneNumber = (number: string): string => {
  // ... logique de formatage
};
```

## 🔧 Maintenance

### Règles à suivre

1. **Documentez tous les composants** exportés
2. **Utilisez des exemples concrets** et fonctionnels
3. **Mettez à jour la documentation** quand le code change
4. **Vérifiez la cohérence** des types et descriptions
5. **Ajoutez des tags personnalisés** si nécessaire

### Vérification

```bash
# Vérifier que la documentation est à jour
npm run lint

# Générer la documentation (si configuré)
npm run docs:generate
```

## 📚 Ressources

- [Documentation officielle JSDoc](https://jsdoc.app/)
- [JSDoc pour React](https://github.com/jsdoc/jsdoc)
- [TypeScript avec JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)

## 🎉 Avantages

- **Documentation automatique** et à jour
- **IDE support** avec autocomplétion
- **Tests intégrés** via TypeScript
- **Collaboration améliorée** entre développeurs
- **Maintenance facilitée** du code legacy
