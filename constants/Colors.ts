export const Colors = {
  // Couleurs principales des sections
  primary: {
    home: '#4CAF50', // Vert pour l'accueil
    info: '#2196F3', // Bleu pour les informations
    phone: '#FF9800', // Orange pour le téléphone
    dialPad: '#9C27B0', // Violet pour le pavé numérique
    call: '#F44336', // Rouge pour l'appel
  },

  // Couleurs secondaires
  secondary: {
    white: '#FFFFFF',
    black: '#000000',
    gray: '#999999',
    lightGray: '#F0F0F0',
    darkGray: '#333333',
  },

  // Couleurs d'état
  status: {
    success: '#4CAF50', // Vert pour succès
    warning: '#FF9800', // Orange pour avertissement
    error: '#F44336', // Rouge pour erreur
    info: '#2196F3', // Bleu pour information
  },

  // Couleurs de batterie
  battery: {
    high: '#4CAF50', // Vert pour batterie haute
    medium: '#FF9800', // Orange pour batterie moyenne
    low: '#F44336', // Rouge pour batterie faible
  },

  // Couleurs de réseau
  network: {
    excellent: '#4CAF50', // Vert pour excellent signal
    good: '#8BC34A', // Vert clair pour bon signal
    fair: '#FF9800', // Orange pour signal moyen
    poor: '#F44336', // Rouge pour mauvais signal
  },

  // Transparences
  transparency: {
    light: 'rgba(255, 255, 255, 0.2)',
    medium: 'rgba(255, 255, 255, 0.25)',
    dark: 'rgba(0, 0, 0, 0.1)',
  },

  // Ombres
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
    },
  },
};

export const Theme = {
  // Espacements
  spacing: {
    xs: 2,
    sm: 5,
    md: 10,
    lg: 15,
    xl: 20,
    xxl: 25,
  },

  // Rayons de bordure
  borderRadius: {
    small: 6,
    medium: 8,
    large: 12,
    xl: 16,
  },

  // Tailles de police
  fontSize: {
    small: 12,
    medium: 14,
    large: 16,
    xl: 18,
    xxl: 22,
    xxxl: 28,
  },

  // Poids de police
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};
