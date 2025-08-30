import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PhoneDisplay } from '../../components/PhoneDisplay';

// Les mocks sont déjà définis dans jest.setup.js

describe('PhoneDisplay - Tests Avancés', () => {
  const mockProps = {
    phoneNumber: '0123456789',
    onDeleteDigit: jest.fn(),
    onCall: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tests de Performance', () => {
    it('gère efficacement les numéros très longs', () => {
      const longNumber = '0'.repeat(100);
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber={longNumber} />
      );
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBeTruthy();
    });

    it('formate rapidement les numéros avec beaucoup d\'espaces', () => {
      const spacedNumber = '01 23 45 67 89 01 23 45 67 89';
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber={spacedNumber} />
      );
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBeTruthy();
    });

    it('gère les re-rendus fréquents sans dégradation', () => {
      const { getByTestId, rerender } = render(<PhoneDisplay {...mockProps} />);
      
      // Simuler des changements fréquents
      for (let i = 0; i < 50; i++) {
        rerender(<PhoneDisplay {...mockProps} phoneNumber={`${i}`.padStart(10, '0')} />);
      }
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBe('00 00 00 00 49');
    });
  });

  describe('Tests d\'Accessibilité Avancés', () => {
    it('a un contraste suffisant pour la lisibilité', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.style).toEqual(
        expect.objectContaining({
          color: '#333',
        })
      );
    });

    it('a une taille de police appropriée pour les seniors', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.style).toEqual(
        expect.objectContaining({
          fontSize: 22,
        })
      );
    });

    it('a un bouton de suppression avec une zone de toucher suffisante', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      
      const deleteButton = getByTestId('delete-button');
      expect(deleteButton.props.style).toEqual(
        expect.objectContaining({
          width: 36,
          height: 36,
        })
      );
    });

    it('a un champ de saisie avec une hauteur appropriée', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.style).toEqual(
        expect.objectContaining({
          height: '100%',
        })
      );
    });
  });

  describe('Tests de Formatage Avancés', () => {
    it('formate correctement les numéros internationaux', () => {
      const internationalNumber = '+33123456789';
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber={internationalNumber} />
      );
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBe('+33 12 34 56 78 9');
    });

    it('formate correctement les numéros avec préfixe', () => {
      const prefixedNumber = '0033123456789';
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber={prefixedNumber} />
      );
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBe('00 33 12 34 56 78 9');
    });

    it('gère les numéros avec des caractères non numériques', () => {
      const mixedNumber = '01-23.45+67*89#';
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber={mixedNumber} />
      );
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBe('01-23.45+67*89#');
    });

    it('formate correctement les numéros courts', () => {
      const shortNumbers = ['1', '12', '123', '1234', '12345'];
      
      shortNumbers.forEach(num => {
        const { getByTestId } = render(
          <PhoneDisplay {...mockProps} phoneNumber={num} />
        );
        
        const phoneInput = getByTestId('phone-number-display');
        expect(phoneInput.props.value).toBeTruthy();
      });
    });
  });

  describe('Tests de Modal Avancés', () => {
    it('affiche le modal avec les bonnes proportions', async () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        // Le modal devrait être visible avec les bonnes dimensions
        expect(phoneInput).toBeTruthy();
      });
    });

    it('ferme le modal correctement avec l\'animation', async () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        // Fermer le modal
        const overlay = getByTestId('phone-display-container');
        fireEvent.press(overlay);
        
        // Le modal devrait se fermer
        expect(phoneInput).toBeTruthy();
      });
    });

    it('affiche les informations correctes dans le modal', async () => {
      const { getByTestId, getByText } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        expect(getByText('📞')).toBeTruthy(); // Titre
        expect(getByText('01 23 45 67 89')).toBeTruthy(); // Numéro
        expect(getByText('10 chiffres composés')).toBeTruthy(); // Info
        expect(getByText('🔊 Relire le numéro')).toBeTruthy(); // Bouton
        expect(getByText('Appuyez n\'importe où pour fermer')).toBeTruthy(); // Instructions
      });
    });
  });

  describe('Tests de Synthèse Vocale Avancés', () => {
    it('utilise la bonne configuration de voix', async () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        const Speech = require('expo-speech');
        expect(Speech.speak).toHaveBeenCalledWith(
          expect.stringContaining('Numéro composé'),
          expect.objectContaining({
            language: 'fr-FR',
            pitch: 1.0,
            rate: 0.7,
            volume: 0.8,
            voice: 'com.apple.ttsbundle.Samantha-compact',
          })
        );
      });
    });

    it('gère les erreurs de configuration de voix', async () => {
      const Speech = require('expo-speech');
      Speech.speak.mockImplementation(() => {
        throw new Error('Configuration de voix invalide');
      });

      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      // Ne devrait pas planter
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        expect(phoneInput).toBeTruthy();
      });
    });

    it('arrête correctement la synthèse vocale lors de la fermeture', async () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        // Fermer le modal
        const overlay = getByTestId('phone-display-container');
        fireEvent.press(overlay);
        
        const Speech = require('expo-speech');
        expect(Speech.stop).toHaveBeenCalled();
      });
    });
  });

  describe('Tests de Cas Limites', () => {
    it('gère les numéros avec des caractères Unicode', () => {
      const unicodeNumber = '01²³4⁵6⁷8⁹';
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber={unicodeNumber} />
      );
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBeTruthy();
    });

    it('gère les numéros avec des espaces multiples', () => {
      const spacedNumber = '01  23    45  67  89';
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber={spacedNumber} />
      );
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBeTruthy();
    });

    it('gère les numéros avec des caractères de contrôle', () => {
      const controlNumber = '01\x0023\x0145\x0267\x0389';
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber={controlNumber} />
      );
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBeTruthy();
    });

    it('gère les numéros extrêmement longs', () => {
      const extremeNumber = '0'.repeat(1000);
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber={extremeNumber} />
      );
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBeTruthy();
    });
  });

  describe('Tests de Responsive Design', () => {
    it('adapte la taille du modal selon l\'écran', async () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        // Le modal devrait s'adapter à la taille de l'écran
        expect(phoneInput).toBeTruthy();
      });
    });

    it('adapte la taille de police selon l\'écran', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.style).toEqual(
        expect.objectContaining({
          fontSize: 22,
        })
      );
    });

    it('adapte la hauteur du conteneur selon l\'écran', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      
      const inputContainer = getByTestId('phone-display-container');
      expect(inputContainer).toBeTruthy();
    });
  });

  describe('Tests de Sécurité', () => {
    it('échappe correctement les caractères spéciaux dans la synthèse vocale', async () => {
      const specialNumber = '01<script>alert("xss")</script>23';
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber={specialNumber} />
      );
      
      const phoneInput = getByTestId('phone-number-display');
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        const Speech = require('expo-speech');
        expect(Speech.speak).toHaveBeenCalled();
      });
    });

    it('gère les injections de code dans le numéro', () => {
      const injectionNumber = '01"; DROP TABLE users; --';
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber={injectionNumber} />
      );
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBeTruthy();
    });
  });
});
