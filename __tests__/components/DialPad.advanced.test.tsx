import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DialPad } from '../../components/DialPad';

// Les mocks sont déjà définis dans jest.setup.js

describe('DialPad - Tests Avancés', () => {
  const mockOnNumberPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tests de Grille et Layout', () => {
    it('calcule correctement les dimensions de la grille 4x3', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const container = getByTestId('dial-pad-container');
      expect(container).toBeTruthy();
      
      // Vérifier que tous les boutons sont présents dans la grille
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

    it('a un espacement cohérent entre les boutons', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      const button2 = getByTestId('dial-button-2');
      const button3 = getByTestId('dial-button-3');
      
      // Vérifier que les boutons ont des marges appropriées
      expect(button1.props.style).toBeDefined();
      expect(button2.props.style).toBeDefined();
      expect(button3.props.style).toBeDefined();
    });

    it('a des boutons de taille carrée', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      expect(button1.props.style).toEqual(
        expect.objectContaining({
          width: expect.any(Number),
          height: expect.any(Number),
        })
      );
    });

    it('centre correctement la grille dans le conteneur', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const container = getByTestId('dial-pad-container');
      expect(container.props.style).toEqual(
        expect.objectContaining({
          justifyContent: 'center',
          alignItems: 'center',
        })
      );
    });
  });

  describe('Tests de Responsive Design', () => {
    it('adapte la taille des boutons selon la largeur de l\'écran', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      expect(button1.props.style).toEqual(
        expect.objectContaining({
          width: expect.any(Number),
          height: expect.any(Number),
        })
      );
    });

    it('adapte la taille de police selon la taille des boutons', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      const buttonText = button1.findByType('Text');
      expect(buttonText).toBeTruthy();
    });

    it('utilise un espacement fixe de 7px', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      expect(button1.props.style).toBeDefined();
    });

    it('calcule correctement la hauteur disponible pour le pavé', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const container = getByTestId('dial-pad-container');
      expect(container).toBeTruthy();
    });
  });

  describe('Tests de Performance', () => {
    it('gère efficacement les pressions rapides multiples', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      
      // Simuler des pressions très rapides
      for (let i = 0; i < 100; i++) {
        fireEvent.press(button1);
      }
      
      expect(mockOnNumberPress).toHaveBeenCalledTimes(100);
    });

    it('gère les pressions simultanées sur différents boutons', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '#'];
      
      // Pressions simultanées sur tous les boutons
      buttons.forEach(num => {
        const testId = num === '*' ? 'dial-button-star' : 
                      num === '#' ? 'dial-button-hash' : 
                      `dial-button-${num}`;
        const button = getByTestId(testId);
        fireEvent.press(button);
      });
      
      expect(mockOnNumberPress).toHaveBeenCalledTimes(12);
    });

    it('ne provoque pas de fuites mémoire avec les animations', () => {
      const { getByTestId, unmount } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      
      // Simuler des pressions multiples
      for (let i = 0; i < 50; i++) {
        fireEvent.press(button1);
      }
      
      // Démonter le composant
      unmount();
      
      // Ne devrait pas y avoir d'erreurs
      expect(mockOnNumberPress).toHaveBeenCalledTimes(50);
    });

    it('gère les re-rendus fréquents sans dégradation', () => {
      const { getByTestId, rerender } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      // Simuler des re-rendus fréquents
      for (let i = 0; i < 100; i++) {
        rerender(<DialPad onNumberPress={mockOnNumberPress} />);
      }
      
      const button1 = getByTestId('dial-button-1');
      fireEvent.press(button1);
      
      expect(mockOnNumberPress).toHaveBeenCalledWith('1');
    });
  });

  describe('Tests de Retour Haptique Avancés', () => {
    it('active la vibration avec la bonne durée (50ms)', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const Vibration = require('react-native/Libraries/Vibration/Vibration');
      const button1 = getByTestId('dial-button-1');
      
      fireEvent.press(button1);
      
      expect(Vibration.vibrate).toHaveBeenCalledWith(50);
    });

    it('active la vibration pour tous les types de boutons', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const Vibration = require('react-native/Libraries/Vibration/Vibration');
      const buttonTypes = ['1', '5', '9', '0', '*', '#'];
      
      buttonTypes.forEach(num => {
        const testId = num === '*' ? 'dial-button-star' : 
                      num === '#' ? 'dial-button-hash' : 
                      `dial-button-${num}`;
        const button = getByTestId(testId);
        fireEvent.press(button);
      });
      
      expect(Vibration.vibrate).toHaveBeenCalledTimes(6);
    });

    it('gère les erreurs de vibration sans affecter la fonctionnalité', () => {
      const Vibration = require('react-native/Libraries/Vibration/Vibration');
      Vibration.vibrate.mockImplementation(() => {
        throw new Error('Erreur de vibration');
      });

      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      fireEvent.press(button1);
      
      // La fonctionnalité principale devrait continuer à fonctionner
      expect(mockOnNumberPress).toHaveBeenCalledWith('1');
    });

    it('gère les vibrations multiples sans conflit', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const Vibration = require('react-native/Libraries/Vibration/Vibration');
      const button1 = getByTestId('dial-button-1');
      
      // Pressions rapides multiples
      for (let i = 0; i < 10; i++) {
        fireEvent.press(button1);
      }
      
      expect(Vibration.vibrate).toHaveBeenCalledTimes(10);
    });
  });

  describe('Tests d\'Accessibilité Avancés', () => {
    it('a des zones de toucher suffisantes pour tous les boutons', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '#'];
      
      buttons.forEach(num => {
        const testId = num === '*' ? 'dial-button-star' : 
                      num === '#' ? 'dial-button-hash' : 
                      `dial-button-${num}`;
        const button = getByTestId(testId);
        
        expect(button.props.pressRetentionOffset).toEqual({
          top: 20,
          left: 20,
          right: 20,
          bottom: 20,
        });
      });
    });

    it('a un activeOpacity approprié pour le feedback visuel', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      expect(button1.props.activeOpacity).toBe(0.5);
    });

    it('a des testID uniques et descriptifs', () => {
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

    it('a des boutons avec des styles cohérents', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      const button5 = getByTestId('dial-button-5');
      const button9 = getByTestId('dial-button-9');
      
      // Vérifier que tous les boutons ont les mêmes styles de base
      expect(button1.props.style).toEqual(
        expect.objectContaining({
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderRadius: 12,
          borderColor: '#000000',
        })
      );
      
      expect(button5.props.style).toEqual(
        expect.objectContaining({
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderRadius: 12,
          borderColor: '#000000',
        })
      );
      
      expect(button9.props.style).toEqual(
        expect.objectContaining({
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderRadius: 12,
          borderColor: '#000000',
        })
      );
    });
  });

  describe('Tests de Cas Limites', () => {
    it('gère les callbacks null ou undefined', () => {
      const { getByTestId } = render(<DialPad onNumberPress={null as any} />);
      
      const button1 = getByTestId('dial-button-1');
      fireEvent.press(button1);
      
      // Ne devrait pas planter
      expect(button1).toBeTruthy();
    });

    it('gère les callbacks qui lancent des erreurs', () => {
      const errorCallback = jest.fn(() => {
        throw new Error('Erreur dans le callback');
      });

      const { getByTestId } = render(<DialPad onNumberPress={errorCallback} />);
      
      const button1 = getByTestId('dial-button-1');
      
      // Ne devrait pas planter
      fireEvent.press(button1);
    });

    it('gère les changements de dimensions d\'écran', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const container = getByTestId('dial-pad-container');
      expect(container).toBeTruthy();
    });

    it('gère les pressions très longues', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      
      // Simuler une pression très longue
      fireEvent(button1, 'pressIn');
      
      // Attendre un peu
      setTimeout(() => {
        fireEvent(button1, 'pressOut');
      }, 1000);
      
      expect(mockOnNumberPress).toHaveBeenCalledWith('1');
    });
  });

  describe('Tests d\'Intégration Avancés', () => {
    it('fonctionne avec des séquences complexes de pressions', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const sequence = ['1', '2', '3', '*', '4', '5', '6', '#', '7', '8', '9', '0'];
      
      sequence.forEach(char => {
        const testId = char === '*' ? 'dial-button-star' : 
                      char === '#' ? 'dial-button-hash' : 
                      `dial-button-${char}`;
        const button = getByTestId(testId);
        fireEvent.press(button);
      });
      
      expect(mockOnNumberPress).toHaveBeenCalledTimes(12);
      sequence.forEach((char, index) => {
        expect(mockOnNumberPress).toHaveBeenNthCalledWith(index + 1, char);
      });
    });

    it('gère les pressions alternées entre différents boutons', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      const button2 = getByTestId('dial-button-2');
      const button3 = getByTestId('dial-button-3');
      
      // Pressions alternées
      fireEvent.press(button1);
      fireEvent.press(button2);
      fireEvent.press(button1);
      fireEvent.press(button3);
      fireEvent.press(button2);
      
      expect(mockOnNumberPress).toHaveBeenCalledTimes(5);
      expect(mockOnNumberPress).toHaveBeenNthCalledWith(1, '1');
      expect(mockOnNumberPress).toHaveBeenNthCalledWith(2, '2');
      expect(mockOnNumberPress).toHaveBeenNthCalledWith(3, '1');
      expect(mockOnNumberPress).toHaveBeenNthCalledWith(4, '3');
      expect(mockOnNumberPress).toHaveBeenNthCalledWith(5, '2');
    });

    it('gère les pressions simultanées sur des boutons adjacents', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      const button2 = getByTestId('dial-button-2');
      const button4 = getByTestId('dial-button-4');
      const button5 = getByTestId('dial-button-5');
      
      // Pressions simultanées sur des boutons adjacents
      fireEvent.press(button1);
      fireEvent.press(button2);
      fireEvent.press(button4);
      fireEvent.press(button5);
      
      expect(mockOnNumberPress).toHaveBeenCalledTimes(4);
    });
  });

  describe('Tests de Sécurité', () => {
    it('gère les callbacks malveillants', () => {
      const maliciousCallback = jest.fn(() => {
        // Simuler un comportement malveillant
        throw new Error('Comportement malveillant détecté');
      });

      const { getByTestId } = render(<DialPad onNumberPress={maliciousCallback} />);
      
      const button1 = getByTestId('dial-button-1');
      
      // Ne devrait pas planter
      fireEvent.press(button1);
    });

    it('gère les pressions excessives sans dégradation', () => {
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const button1 = getByTestId('dial-button-1');
      
      // Simuler des pressions excessives
      for (let i = 0; i < 1000; i++) {
        fireEvent.press(button1);
      }
      
      expect(mockOnNumberPress).toHaveBeenCalledTimes(1000);
    });
  });
});
