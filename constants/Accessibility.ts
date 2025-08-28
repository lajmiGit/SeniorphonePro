export const AccessibilityConfig = {
  // Configuration des vibrations
  vibration: {
    short: 50, // Vibration courte pour les touches
    medium: 100, // Vibration moyenne pour les actions
    long: 200, // Vibration longue pour les erreurs
  },

  // Configuration des tailles de police
  fontSize: {
    small: 16, // Taille minimale recommandée pour les seniors
    medium: 18, // Taille standard
    large: 22, // Taille grande pour une meilleure lisibilité
    extraLarge: 28, // Taille très grande pour les éléments importants
  },

  // Configuration des contrastes
  contrast: {
    minimum: 4.5, // Ratio de contraste minimum recommandé
    enhanced: 7.0, // Ratio de contraste amélioré
  },

  // Configuration des espacements
  spacing: {
    touchTarget: 44, // Taille minimale des zones tactiles (en points)
    betweenElements: 8, // Espacement minimum entre les éléments
    sectionPadding: 12, // Padding des sections
  },

  // Configuration des couleurs
  colors: {
    // Couleurs avec un bon contraste pour les seniors
    text: {
      primary: '#000000', // Noir sur fond clair
      secondary: '#333333', // Gris foncé
      disabled: '#999999', // Gris clair pour éléments désactivés
    },
    background: {
      primary: '#FFFFFF', // Blanc
      secondary: '#F0F0F0', // Gris très clair
      accent: '#4CAF50', // Vert d'accent
    },
  },

  // Configuration des animations
  animations: {
    duration: {
      fast: 200, // Animation rapide
      normal: 300, // Animation normale
      slow: 500, // Animation lente
    },
    easing: 'ease-in-out', // Type d'animation
  },

  // Configuration des feedbacks
  feedback: {
    haptic: true, // Activer les vibrations haptiques
    audio: false, // Désactiver les sons par défaut
    visual: true, // Activer les retours visuels
  },

  // Configuration des limites
  limits: {
    maxPhoneNumberLength: 15, // Longueur maximale du numéro
    maxRecentCalls: 10, // Nombre maximum d'appels récents
    autoLockDelay: 30000, // Délai d'auto-verrouillage (30s)
  },

  // Configuration des fonctionnalités spéciales
  features: {
    largeButtons: true, // Boutons plus grands
    highContrast: true, // Mode contraste élevé
    simplifiedInterface: true, // Interface simplifiée
    voiceFeedback: false, // Retour vocal (désactivé par défaut)
    gestureNavigation: false, // Navigation par gestes (désactivée)
  },
};

export const SeniorFeatures = {
  // Fonctionnalités spécifiques aux seniors
  emergency: {
    enabled: true,
    shortcutKey: '#', // Touche raccourci pour l'urgence
    autoDial: '112', // Numéro d'urgence par défaut
    vibrationPattern: [0, 500, 200, 500, 200, 500], // Pattern de vibration
  },

  contacts: {
    favorites: true, // Contacts favoris
    quickDial: true, // Composition rapide
    voiceDial: false, // Composition vocale
    maxFavorites: 5, // Nombre maximum de favoris
  },

  display: {
    autoBrightness: true, // Luminosité automatique
    nightMode: true, // Mode nuit
    fontSizeAdjustment: true, // Ajustement de la taille de police
    colorBlindSupport: true, // Support daltonisme
  },

  sound: {
    ringtoneVolume: 0.8, // Volume de la sonnerie (80%)
    vibrationIntensity: 0.9, // Intensité des vibrations (90%)
    silentMode: false, // Mode silencieux désactivé par défaut
    hearingAidCompatible: true, // Compatible appareils auditifs
  },
};
