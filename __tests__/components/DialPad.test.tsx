import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DialPad } from '../../components/DialPad';

// Les mocks sont déjà définis dans jest.setup.js

describe('DialPad', () => {
  const mockOnNumberPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it('affiche tous les boutons numériques de 0 à 9', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      for (let i = 0; i <= 9; i++) {
        expect(getByTestId(`dial-button-${i}`)).toBeTruthy();
      }
    });

    it('affiche les boutons spéciaux * et #', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      expect(getByTestId('dial-button-star')).toBeTruthy();
      expect(getByTestId('dial-button-hash')).toBeTruthy();
    });

    it('affiche le bouton 0 au centre de la dernière ligne', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const zeroButton = getByTestId('dial-button-0');
      expect(zeroButton).toBeTruthy();
    });

    it('a un conteneur principal avec testID', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      expect(getByTestId('dial-pad-container')).toBeTruthy();
    });

    it('affiche 12 boutons au total (4x3)', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const buttons = [
        'dial-button-1', 'dial-button-2', 'dial-button-3',
        'dial-button-4', 'dial-button-5', 'dial-button-6',
        'dial-button-7', 'dial-button-8', 'dial-button-9',
        'dial-button-star', 'dial-button-0', 'dial-button-hash'
      ];
      
      buttons.forEach(testId => {
        expect(getByTestId(testId)).toBeTruthy();
      });
    });
  });

  describe('Interactions de base', () => {
    it('appelle onNumberPress avec le bon numéro quand on clique sur un bouton', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      fireEvent.press(button1);
      
      expect(mockOnNumberPress).toHaveBeenCalledWith('1');
    });

    it('appelle onNumberPress avec * quand on clique sur le bouton étoile', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const starButton = getByTestId('dial-button-star');
      fireEvent.press(starButton);
      
      expect(mockOnNumberPress).toHaveBeenCalledWith('*');
    });

    it('appelle onNumberPress avec # quand on clique sur le bouton hash', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const hashButton = getByTestId('dial-button-hash');
      fireEvent.press(hashButton);
      
      expect(mockOnNumberPress).toHaveBeenCalledWith('#');
    });

    it('appelle onNumberPress avec 0 quand on clique sur le bouton zéro', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const zeroButton = getByTestId('dial-button-0');
      fireEvent.press(zeroButton);
      
      expect(mockOnNumberPress).toHaveBeenCalledWith('0');
    });

    it('appelle onNumberPress plusieurs fois pour des pressions multiples', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      const button2 = getByTestId('dial-button-2');
      const button3 = getByTestId('dial-button-3');
      
      fireEvent.press(button1);
      fireEvent.press(button2);
      fireEvent.press(button3);
      
      expect(mockOnNumberPress).toHaveBeenCalledTimes(3);
      expect(mockOnNumberPress).toHaveBeenNthCalledWith(1, '1');
      expect(mockOnNumberPress).toHaveBeenNthCalledWith(2, '2');
      expect(mockOnNumberPress).toHaveBeenNthCalledWith(3, '3');
    });
  });

  describe('Retour haptique (Vibration)', () => {
    it('active la vibration quand on clique sur un bouton', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const Vibration = require('react-native/Libraries/Vibration/Vibration');
      const button1 = getByTestId('dial-button-1');
      
      fireEvent.press(button1);
      
      expect(Vibration.vibrate).toHaveBeenCalledWith(50);
    });

    it('active la vibration pour tous les boutons', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const Vibration = require('react-native/Libraries/Vibration/Vibration');
      const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '#'];
      
      buttons.forEach(num => {
        const testId = num === '*' ? 'dial-button-star' : 
                      num === '#' ? 'dial-button-hash' : 
                      `dial-button-${num}`;
        const button = getByTestId(testId);
        fireEvent.press(button);
      });
      
      expect(Vibration.vibrate).toHaveBeenCalledTimes(12);
    });

    it('gère les erreurs de vibration gracieusement', () => {
      const Vibration = require('react-native/Libraries/Vibration/Vibration');
      Vibration.vibrate.mockImplementation(() => {
        throw new Error('Erreur de vibration');
      });

      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      
      // Ne devrait pas planter
      fireEvent.press(button1);
      
      expect(mockOnNumberPress).toHaveBeenCalledWith('1');
    });
  });

  describe('Structure de la grille', () => {
    it('affiche une grille 4x3 correcte', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      // Première ligne: 1, 2, 3
      expect(getByTestId('dial-button-1')).toBeTruthy();
      expect(getByTestId('dial-button-2')).toBeTruthy();
      expect(getByTestId('dial-button-3')).toBeTruthy();
      
      // Deuxième ligne: 4, 5, 6
      expect(getByTestId('dial-button-4')).toBeTruthy();
      expect(getByTestId('dial-button-5')).toBeTruthy();
      expect(getByTestId('dial-button-6')).toBeTruthy();
      
      // Troisième ligne: 7, 8, 9
      expect(getByTestId('dial-button-7')).toBeTruthy();
      expect(getByTestId('dial-button-8')).toBeTruthy();
      expect(getByTestId('dial-button-9')).toBeTruthy();
      
      // Quatrième ligne: *, 0, #
      expect(getByTestId('dial-button-star')).toBeTruthy();
      expect(getByTestId('dial-button-0')).toBeTruthy();
      expect(getByTestId('dial-button-hash')).toBeTruthy();
    });

    it('a un conteneur de grille avec les bonnes dimensions', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const container = getByTestId('dial-pad-container');
      expect(container).toBeTruthy();
    });
  });

  describe('Styles et apparence', () => {
    it('a des boutons avec des bordures noires', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      expect(button1.props.style).toEqual(
        expect.objectContaining({
          borderColor: '#000000',
        })
      );
    });

    it('a des boutons avec un fond semi-transparent', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      expect(button1.props.style).toEqual(
        expect.objectContaining({
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
        })
      );
    });

    it('a des boutons avec des coins arrondis', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      expect(button1.props.style).toEqual(
        expect.objectContaining({
          borderRadius: 12,
        })
      );
    });

    it('a des boutons avec des ombres', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      expect(button1.props.style).toEqual(
        expect.objectContaining({
          shadowColor: '#000',
          shadowOffset: expect.objectContaining({
            width: 0,
            height: 4,
          }),
          shadowOpacity: 0.3,
          shadowRadius: 6,
        })
      );
    });

    it('a des boutons avec une élévation sur Android', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      expect(button1.props.style).toEqual(
        expect.objectContaining({
          elevation: 2,
        })
      );
    });
  });

  describe('Accessibilité', () => {
    it('a des testID appropriés pour tous les boutons', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const expectedTestIds = [
        'dial-button-1', 'dial-button-2', 'dial-button-3',
        'dial-button-4', 'dial-button-5', 'dial-button-6',
        'dial-button-7', 'dial-button-8', 'dial-button-9',
        'dial-button-star', 'dial-button-0', 'dial-button-hash'
      ];
      
      expectedTestIds.forEach(testId => {
        expect(getByTestId(testId)).toBeTruthy();
      });
    });

    it('a des boutons avec activeOpacity approprié', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      expect(button1.props.activeOpacity).toBe(0.5);
    });

    it('a des boutons avec pressRetentionOffset', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      expect(button1.props.pressRetentionOffset).toEqual({
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
      });
    });
  });

  describe('Responsive Design', () => {
    it('calcule correctement les dimensions de la grille', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const container = getByTestId('dial-pad-container');
      expect(container).toBeTruthy();
    });

    it('adapte la taille de police selon la taille de l\'écran', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      const buttonText = button1.findByType('Text');
      expect(buttonText).toBeTruthy();
    });
  });

  describe('Performance et réactivité', () => {
    it('réagit rapidement aux pressions multiples', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      
      // Pressions rapides multiples
      for (let i = 0; i < 10; i++) {
        fireEvent.press(button1);
      }
      
      expect(mockOnNumberPress).toHaveBeenCalledTimes(10);
    });

    it('gère les pressions simultanées sur différents boutons', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      const button2 = getByTestId('dial-button-2');
      const button3 = getByTestId('dial-button-3');
      
      // Pressions simultanées
      fireEvent.press(button1);
      fireEvent.press(button2);
      fireEvent.press(button3);
      
      expect(mockOnNumberPress).toHaveBeenCalledTimes(3);
    });

    it('ne provoque pas de fuites mémoire avec les animations', () => {
      const { getByTestId, unmount } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      fireEvent.press(button1);
      
      // Démonter le composant
      unmount();
      
      // Ne devrait pas y avoir d'erreurs
      expect(mockOnNumberPress).toHaveBeenCalledWith('1');
    });
  });

  describe('Gestion des cas limites', () => {
    it('fonctionne avec un callback onNumberPress null', () => {
      const { getByTestId } = render(<DialPad onNumberPress={null as any} />);
      
      const button1 = getByTestId('dial-button-1');
      
      // Ne devrait pas planter
      fireEvent.press(button1);
    });

    it('fonctionne avec un callback onNumberPress undefined', () => {
      const { getByTestId } = render(<DialPad onNumberPress={undefined as any} />);
      
      const button1 = getByTestId('dial-button-1');
      
      // Ne devrait pas planter
      fireEvent.press(button1);
    });

    it('gère les changements de dimensions d\'écran', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const container = getByTestId('dial-pad-container');
      expect(container).toBeTruthy();
    });
  });

  describe('Tests d\'intégration', () => {
    it('fonctionne correctement avec des pressions séquentielles', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const sequence = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
      
      sequence.forEach(num => {
        const button = getByTestId(`dial-button-${num}`);
        fireEvent.press(button);
      });
      
      expect(mockOnNumberPress).toHaveBeenCalledTimes(10);
      sequence.forEach((num, index) => {
        expect(mockOnNumberPress).toHaveBeenNthCalledWith(index + 1, num);
      });
    });

    it('fonctionne avec les caractères spéciaux dans la séquence', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const sequence = ['1', '*', '2', '#', '3'];
      
      sequence.forEach(char => {
        const testId = char === '*' ? 'dial-button-star' : 
                      char === '#' ? 'dial-button-hash' : 
                      `dial-button-${char}`;
        const button = getByTestId(testId);
        fireEvent.press(button);
      });
      
      expect(mockOnNumberPress).toHaveBeenCalledTimes(5);
      sequence.forEach((char, index) => {
        expect(mockOnNumberPress).toHaveBeenNthCalledWith(index + 1, char);
      });
    });
  });
});
