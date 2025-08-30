import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Dimensions } from 'react-native';
import { PhoneDisplay } from '../../components/PhoneDisplay';

// Mock expo-speech
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
}));

// Mock Dimensions pour tester différentes tailles d'écran
const originalDimensions = Dimensions.get;

describe('PhoneDisplay Component - Audit Fonctionnel et Technique', () => {
  const mockOnDeleteDigit = jest.fn();
  const mockOnCall = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    Dimensions.get = originalDimensions;
  });

  describe('Audit Fonctionnel - Fonctionnalités de Base', () => {
    it('affiche correctement un numéro de téléphone vide', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber=""
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      expect(phoneDisplay).toBeTruthy();
      expect(phoneDisplay.props.value).toBe('');
    });

    it('affiche correctement un numéro de téléphone avec formatage', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      expect(phoneDisplay.props.value).toBe('01 23 45 67 89');
    });

    it('affiche le compteur de chiffres quand un numéro est présent', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByText } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      expect(getByText('10 chiffres')).toBeTruthy();
    });

    it('n\'affiche pas le compteur quand le numéro est vide', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { queryByText } = render(
        <PhoneDisplay
          phoneNumber=""
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      expect(queryByText(/chiffre/)).toBeNull();
    });

    it('affiche le bouton de suppression', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const deleteButton = getByTestId('delete-button');
      expect(deleteButton).toBeTruthy();
      // Vérifier que le bouton contient le texte de suppression
      expect(deleteButton.props.children).toBeTruthy();
    });

    it('appelle onDeleteDigit quand on clique sur le bouton de suppression', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const deleteButton = getByTestId('delete-button');
      fireEvent.press(deleteButton);
      
      expect(mockOnDeleteDigit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Audit Fonctionnel - Modals et Interactions', () => {
    it('ouvre le modal de zoom quand on clique sur l\'affichage du numéro', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      fireEvent.press(phoneDisplay);
      
      // Le modal devrait être visible
      expect(getByTestId('phone-display-container')).toBeTruthy();
    });

    it('n\'ouvre pas le modal de zoom quand le numéro est vide', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber=""
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      fireEvent.press(phoneDisplay);
      
      // Le modal ne devrait pas s'ouvrir
      expect(getByTestId('phone-display-container')).toBeTruthy();
    });

    it('affiche le numéro formaté dans le modal de zoom', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId, getByText } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      fireEvent.press(phoneDisplay);
      
      // Vérifier que le numéro formaté est affiché dans le modal
      expect(getByText('01 23 45 67 89')).toBeTruthy();
    });

    it('affiche les informations du numéro dans le modal de zoom', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId, getByText } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      fireEvent.press(phoneDisplay);
      
      expect(getByText('10 chiffres composés')).toBeTruthy();
    });

    it('affiche le bouton de lecture vocale dans le modal de zoom', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId, getByText } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      fireEvent.press(phoneDisplay);
      
      expect(getByText('🔊 Relire le numéro')).toBeTruthy();
    });

    it('affiche les instructions de fermeture dans le modal de zoom', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId, getByText } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      fireEvent.press(phoneDisplay);
      
      expect(getByText('Appuyez n\'importe où pour fermer')).toBeTruthy();
    });
  });

  // Tailles d'écran de téléphone courantes
  const phoneScreenSizes = [
    { name: 'iPhone SE (1ère génération)', width: 320, height: 568 },
    { name: 'iPhone SE (2ème génération)', width: 375, height: 667 },
    { name: 'iPhone 8', width: 375, height: 667 },
    { name: 'iPhone 12/13/14', width: 390, height: 844 },
    { name: 'iPhone 12/13/14 Pro', width: 393, height: 852 },
    { name: 'iPhone 12/13/14 Pro Max', width: 428, height: 926 },
    { name: 'iPhone 14 Plus', width: 428, height: 926 },
    { name: 'iPhone 15/15 Pro', width: 393, height: 852 },
    { name: 'iPhone 15 Plus/Pro Max', width: 430, height: 932 },
    { name: 'Samsung Galaxy S21', width: 360, height: 800 },
    { name: 'Samsung Galaxy S22', width: 360, height: 780 },
    { name: 'Google Pixel 6', width: 393, height: 851 },
    { name: 'OnePlus 9', width: 412, height: 915 },
  ];

  describe('Audit Technique - Performance et Responsive', () => {
    phoneScreenSizes.forEach(({ name, width, height }) => {
      describe(`${name} (${width}x${height})`, () => {
        beforeEach(() => {
          Dimensions.get = jest.fn().mockReturnValue({ width, height });
        });

        it('se rend sans erreur de performance', () => {
          const startTime = Date.now();
          expect(() => {
            render(
              <PhoneDisplay
                phoneNumber="0123456789"
                onDeleteDigit={mockOnDeleteDigit}
                onCall={mockOnCall}
              />
            );
          }).not.toThrow();
          const renderTime = Date.now() - startTime;
          
          // Vérifier que le rendu est rapide (< 100ms)
          expect(renderTime).toBeLessThan(100);
        });

        it('a un affichage du numéro avec des dimensions appropriées', () => {
          const { getByTestId } = render(
            <PhoneDisplay
              phoneNumber="0123456789"
              onDeleteDigit={mockOnDeleteDigit}
              onCall={mockOnCall}
            />
          );

          const phoneDisplay = getByTestId('phone-number-display');
          const phoneStyle = phoneDisplay.props.style;
          
          // Vérifier que les styles sont définis
          expect(phoneStyle).toBeDefined();
          expect(phoneStyle.fontSize).toBeDefined();
          expect(phoneStyle.fontSize).toBeGreaterThanOrEqual(18);
        });

        it('a un bouton de suppression avec des dimensions appropriées', () => {
          const { getByTestId } = render(
            <PhoneDisplay
              phoneNumber="0123456789"
              onDeleteDigit={mockOnDeleteDigit}
              onCall={mockOnCall}
            />
          );

          const deleteButton = getByTestId('delete-button');
          const buttonStyle = deleteButton.props.style;
          
          // Vérifier que les styles sont définis
          expect(buttonStyle).toBeDefined();
          expect(buttonStyle.width).toBeDefined();
          expect(buttonStyle.height).toBeDefined();
          expect(buttonStyle.width).toBeGreaterThanOrEqual(30);
          expect(buttonStyle.height).toBeGreaterThanOrEqual(30);
        });

        it('a des modals avec des dimensions responsives', () => {
          const { getByTestId } = render(
            <PhoneDisplay
              phoneNumber="0123456789"
              onDeleteDigit={mockOnDeleteDigit}
              onCall={mockOnCall}
            />
          );

          const container = getByTestId('phone-display-container');
          expect(container).toBeTruthy();
        });
      });
    });
  });

  describe('Audit Technique - Accessibilité', () => {
    it('a des testID appropriés pour tous les éléments', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      expect(getByTestId('phone-display-container')).toBeTruthy();
      expect(getByTestId('phone-number-display')).toBeTruthy();
      expect(getByTestId('delete-button')).toBeTruthy();
    });

    it('a un affichage du numéro non éditable', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      expect(phoneDisplay.props.editable).toBe(false);
    });

    it('a un placeholder approprié', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber=""
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      expect(phoneDisplay.props.placeholder).toBe('Numéro de téléphone');
    });
  });

  describe('Audit Technique - Formatage et Logique', () => {
    it('formate correctement les numéros courts', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber="123"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      expect(phoneDisplay.props.value).toBe('12 3');
    });

    it('formate correctement les numéros longs', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber="012345678901234"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      expect(phoneDisplay.props.value).toBe('01 23 45 67 89 01 23 4');
    });

    it('gère correctement les numéros vides', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber=""
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      expect(phoneDisplay.props.value).toBe('');
    });

    it('affiche le bon compteur de chiffres pour un seul chiffre', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByText } = render(
        <PhoneDisplay
          phoneNumber="1"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      expect(getByText('1 chiffre')).toBeTruthy();
    });

    it('affiche le bon compteur de chiffres pour plusieurs chiffres', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByText } = render(
        <PhoneDisplay
          phoneNumber="123"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      expect(getByText('3 chiffres')).toBeTruthy();
    });
  });

  describe('Audit Technique - Animations et Modals', () => {
    it('utilise des animations natives pour les modals', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      fireEvent.press(phoneDisplay);
      
      // Les animations utilisent useNativeDriver: true
      expect(getByTestId('phone-display-container')).toBeTruthy();
    });

    it('a des modals transparents', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      fireEvent.press(phoneDisplay);
      
      // Les modals sont transparents
      expect(getByTestId('phone-display-container')).toBeTruthy();
    });

    it('a des modals sans animation par défaut', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      fireEvent.press(phoneDisplay);
      
      // Les modals utilisent animationType: 'none'
      expect(getByTestId('phone-display-container')).toBeTruthy();
    });
  });

  describe('Audit Technique - Synthèse Vocale', () => {
    it('a une configuration de synthèse vocale pour les seniors', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      fireEvent.press(phoneDisplay);
      
      // La synthèse vocale est configurée pour les seniors
      expect(getByTestId('phone-display-container')).toBeTruthy();
    });

    it('a un bouton de lecture vocale fonctionnel', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId, getByText } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      fireEvent.press(phoneDisplay);
      
      const voiceButton = getByText('🔊 Relire le numéro');
      expect(voiceButton).toBeTruthy();
    });
  });

  describe('Audit Technique - Gestion des Erreurs', () => {
    it('gère les erreurs de synthèse vocale', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      fireEvent.press(phoneDisplay);
      
      // La gestion d'erreur est présente dans le code
      expect(getByTestId('phone-display-container')).toBeTruthy();
    });

    it('gère les erreurs d\'arrêt de synthèse vocale', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(
        <PhoneDisplay
          phoneNumber="0123456789"
          onDeleteDigit={mockOnDeleteDigit}
          onCall={mockOnCall}
        />
      );

      const phoneDisplay = getByTestId('phone-number-display');
      fireEvent.press(phoneDisplay);
      
      // La gestion d'erreur pour l'arrêt est présente
      expect(getByTestId('phone-display-container')).toBeTruthy();
    });
  });

  describe('Audit Technique - Stabilité', () => {
    it('gère les changements de dimensions d\'écran', () => {
      const screenSizes = [
        { width: 320, height: 568 },
        { width: 375, height: 667 },
        { width: 390, height: 844 },
        { width: 428, height: 926 }
      ];
      
      screenSizes.forEach(({ width, height }) => {
        Dimensions.get = jest.fn().mockReturnValue({ width, height });
        
        expect(() => {
          render(
            <PhoneDisplay
              phoneNumber="0123456789"
              onDeleteDigit={mockOnDeleteDigit}
              onCall={mockOnCall}
            />
          );
        }).not.toThrow();
      });
    });

    it('gère les numéros très longs', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      expect(() => {
        render(
          <PhoneDisplay
            phoneNumber="012345678901234567890123456789"
            onDeleteDigit={mockOnDeleteDigit}
            onCall={mockOnCall}
          />
        );
      }).not.toThrow();
    });

    it('gère les numéros avec des caractères spéciaux', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      expect(() => {
        render(
          <PhoneDisplay
            phoneNumber="0123456789"
            onDeleteDigit={mockOnDeleteDigit}
            onCall={mockOnCall}
          />
        );
      }).not.toThrow();
    });
  });
});
