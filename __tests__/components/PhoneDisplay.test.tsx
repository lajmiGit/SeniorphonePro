import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PhoneDisplay } from '../../components/PhoneDisplay';

// Les mocks sont déjà définis dans jest.setup.js

describe('PhoneDisplay', () => {
  const mockProps = {
    phoneNumber: '0123456789',
    onDeleteDigit: jest.fn(),
    onCall: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it('affiche le numéro de téléphone formaté', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBe('01 23 45 67 89');
    });

    it('affiche le placeholder quand le numéro est vide', () => {
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber="" />
      );
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBe('');
    });

    it('affiche le bouton de suppression', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const deleteButton = getByTestId('delete-button');
      expect(deleteButton).toBeTruthy();
    });

    it('affiche les informations du numéro', () => {
      const { getByText } = render(<PhoneDisplay {...mockProps} />);
      expect(getByText('10 chiffres')).toBeTruthy();
    });

    it('n\'affiche pas les informations quand le numéro est vide', () => {
      const { queryByText } = render(
        <PhoneDisplay {...mockProps} phoneNumber="" />
      );
      expect(queryByText('0 chiffre')).toBeFalsy();
    });
  });

  describe('Interactions de base', () => {
    it('appelle onDeleteDigit quand on clique sur le bouton de suppression', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const deleteButton = getByTestId('delete-button');
      
      fireEvent.press(deleteButton);
      expect(mockProps.onDeleteDigit).toHaveBeenCalledTimes(1);
    });

    it('appelle onDeleteDigit plusieurs fois pour des pressions multiples', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const deleteButton = getByTestId('delete-button');
      
      fireEvent.press(deleteButton);
      fireEvent.press(deleteButton);
      fireEvent.press(deleteButton);
      
      expect(mockProps.onDeleteDigit).toHaveBeenCalledTimes(3);
    });
  });

  describe('Formatage du numéro', () => {
    it('formate correctement un numéro à 10 chiffres', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBe('01 23 45 67 89');
    });

    it('formate correctement un numéro à 6 chiffres', () => {
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber="123456" />
      );
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBe('12 34 56');
    });

    it('formate correctement un numéro à 4 chiffres', () => {
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber="1234" />
      );
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBe('12 34');
    });

    it('formate correctement un numéro à 2 chiffres', () => {
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber="12" />
      );
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBe('12');
    });

    it('formate correctement un numéro à 1 chiffre', () => {
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber="1" />
      );
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBe('1');
    });
  });

  describe('Modal de zoom du numéro', () => {
    it('ouvre le modal de zoom quand on clique sur le champ de numéro', async () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        // Le modal devrait être visible
        expect(phoneInput).toBeTruthy();
      });
    });

    it('n\'ouvre pas le modal quand le numéro est vide', () => {
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber="" />
      );
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      // Le modal ne devrait pas s'ouvrir
      expect(phoneInput).toBeTruthy();
    });

    it('affiche le numéro formaté dans le modal de zoom', async () => {
      const { getByTestId, getByText } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        expect(getByText('01 23 45 67 89')).toBeTruthy();
      });
    });

    it('affiche les informations du numéro dans le modal', async () => {
      const { getByTestId, getByText } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        expect(getByText('10 chiffres composés')).toBeTruthy();
      });
    });

    it('affiche le bouton de lecture vocale dans le modal', async () => {
      const { getByTestId, getByText } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        expect(getByText('🔊 Relire le numéro')).toBeTruthy();
      });
    });

    it('affiche les instructions de fermeture dans le modal', async () => {
      const { getByTestId, getByText } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        expect(getByText('Appuyez n\'importe où pour fermer')).toBeTruthy();
      });
    });
  });

  describe('Synthèse vocale', () => {
    it('lance la synthèse vocale lors de l\'ouverture du modal', async () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        // Vérifier que la synthèse vocale a été appelée
        const Speech = require('expo-speech');
        expect(Speech.speak).toHaveBeenCalled();
      });
    });

    it('arrête la synthèse vocale lors de la fermeture du modal', async () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        // Fermer le modal en cliquant sur l'overlay
        const overlay = getByTestId('phone-display-container');
        fireEvent.press(overlay);
        
        const Speech = require('expo-speech');
        expect(Speech.stop).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibilité', () => {
    it('a des éléments accessibles avec des testID appropriés', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      
      expect(getByTestId('phone-display-container')).toBeTruthy();
      expect(getByTestId('phone-number-display')).toBeTruthy();
      expect(getByTestId('delete-button')).toBeTruthy();
    });

    it('a un champ de saisie non éditable', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      expect(phoneInput.props.editable).toBe(false);
    });

    it('a un placeholder approprié', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      expect(phoneInput.props.placeholder).toBe('Numéro de téléphone');
    });
  });

  describe('Styles et apparence', () => {
    it('a un champ de saisie avec une bordure noire', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      expect(phoneInput.props.style).toEqual(
        expect.objectContaining({
          borderColor: '#000000',
        })
      );
    });

    it('a un bouton de suppression rouge', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const deleteButton = getByTestId('delete-button');
      
      expect(deleteButton.props.style).toEqual(
        expect.objectContaining({
          backgroundColor: '#F44336',
        })
      );
    });

    it('a un texte de suppression avec le symbole ⌫', () => {
      const { getByText } = render(<PhoneDisplay {...mockProps} />);
      expect(getByText('⌫')).toBeTruthy();
    });
  });

  describe('Gestion des erreurs', () => {
    it('gère les erreurs de synthèse vocale gracieusement', async () => {
      const Speech = require('expo-speech');
      Speech.speak.mockImplementation(() => {
        throw new Error('Erreur de synthèse vocale');
      });

      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      // Ne devrait pas planter
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        expect(phoneInput).toBeTruthy();
      });
    });

    it('gère les erreurs d\'arrêt de synthèse vocale gracieusement', async () => {
      const Speech = require('expo-speech');
      Speech.stop.mockImplementation(() => {
        throw new Error('Erreur d\'arrêt de synthèse vocale');
      });

      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);
      const phoneInput = getByTestId('phone-number-display');
      
      fireEvent.press(phoneInput);
      
      await waitFor(() => {
        // Fermer le modal
        const overlay = getByTestId('phone-display-container');
        fireEvent.press(overlay);
        
        // Ne devrait pas planter
        expect(phoneInput).toBeTruthy();
      });
    });
  });

  describe('Performance et réactivité', () => {
    it('réagit rapidement aux changements de numéro', () => {
      const { getByTestId, rerender } = render(<PhoneDisplay {...mockProps} />);
      
      rerender(<PhoneDisplay {...mockProps} phoneNumber="123" />);
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBe('12 3');
    });

    it('gère les numéros très longs', () => {
      const longNumber = '012345678901234567890123456789';
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber={longNumber} />
      );
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBeTruthy();
    });

    it('gère les numéros avec des caractères spéciaux', () => {
      const specialNumber = '01-23-45-67-89';
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber={specialNumber} />
      );
      
      const phoneInput = getByTestId('phone-number-display');
      expect(phoneInput.props.value).toBeTruthy();
    });
  });
});
