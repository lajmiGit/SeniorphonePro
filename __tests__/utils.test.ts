// Tests pour les fonctions utilitaires

// Fonction de formatage du numéro de téléphone
const formatPhoneNumber = (number: string): string => {
  if (number.length === 0) {
    return '';
  }
  // Formatage pour la lisibilité (ajout d'espaces tous les 2 chiffres)
  return number.replace(/(\d{2})(?=\d)/g, '$1 ');
};

// Fonction de validation du numéro de téléphone
const isValidPhoneNumber = (number: string): boolean => {
  const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
  return phoneRegex.test(number);
};

// Fonction de calcul de la couleur de la batterie
const getBatteryColor = (level: number): string => {
  if (level > 50) {
    return '#4CAF50'; // Vert
  }
  if (level > 20) {
    return '#FF9800'; // Orange
  }
  return '#F44336'; // Rouge
};

// Fonction de calcul de la couleur du réseau
const getNetworkColor = (level: number): string => {
  if (level > 3) {
    return '#4CAF50'; // Vert
  }
  if (level > 1) {
    return '#FF9800'; // Orange
  }
  return '#F44336'; // Rouge
};

describe('Fonctions Utilitaires', () => {
  describe('formatPhoneNumber', () => {
    test('retourne une chaîne vide pour un numéro vide', () => {
      expect(formatPhoneNumber('')).toBe('');
    });

    test('formate correctement un numéro de 10 chiffres', () => {
      expect(formatPhoneNumber('0123456789')).toBe('01 23 45 67 89');
    });

    test('formate correctement un numéro de 15 chiffres', () => {
      expect(formatPhoneNumber('012345678901234')).toBe(
        '01 23 45 67 89 01 23 4'
      );
    });

    test('ne modifie pas un numéro déjà formaté', () => {
      expect(formatPhoneNumber('01 23 45 67 89')).toBe('01 23 45 67 89');
    });
  });

  describe('isValidPhoneNumber', () => {
    test('valide un numéro de téléphone français', () => {
      expect(isValidPhoneNumber('0123456789')).toBe(true);
      expect(isValidPhoneNumber('+33123456789')).toBe(true);
      expect(isValidPhoneNumber('01 23 45 67 89')).toBe(true);
    });

    test('rejette les numéros trop courts', () => {
      expect(isValidPhoneNumber('123')).toBe(false);
      expect(isValidPhoneNumber('0123456')).toBe(false);
    });

    test('rejette les numéros trop longs', () => {
      expect(isValidPhoneNumber('01234567890123456789')).toBe(false);
    });

    test('rejette les caractères invalides', () => {
      expect(isValidPhoneNumber('012345678a')).toBe(false);
      expect(isValidPhoneNumber('012345678!')).toBe(false);
    });
  });

  describe('getBatteryColor', () => {
    test('retourne vert pour un niveau élevé', () => {
      expect(getBatteryColor(90)).toBe('#4CAF50');
      expect(getBatteryColor(75)).toBe('#4CAF50');
      expect(getBatteryColor(51)).toBe('#4CAF50');
    });

    test('retourne orange pour un niveau moyen', () => {
      expect(getBatteryColor(50)).toBe('#FF9800');
      expect(getBatteryColor(35)).toBe('#FF9800');
      expect(getBatteryColor(21)).toBe('#FF9800');
    });

    test('retourne rouge pour un niveau faible', () => {
      expect(getBatteryColor(20)).toBe('#F44336');
      expect(getBatteryColor(10)).toBe('#F44336');
      expect(getBatteryColor(5)).toBe('#F44336');
    });
  });

  describe('getNetworkColor', () => {
    test('retourne vert pour un signal fort', () => {
      expect(getNetworkColor(5)).toBe('#4CAF50');
      expect(getNetworkColor(4)).toBe('#4CAF50');
    });

    test('retourne orange pour un signal moyen', () => {
      expect(getNetworkColor(3)).toBe('#FF9800');
      expect(getNetworkColor(2)).toBe('#FF9800');
    });

    test('retourne rouge pour un signal faible', () => {
      expect(getNetworkColor(1)).toBe('#F44336');
      expect(getNetworkColor(0)).toBe('#F44336');
    });
  });
});
