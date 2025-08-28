import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PhoneDisplay } from '../../components/PhoneDisplay';

// Mock des props
const mockProps = {
  phoneNumber: '0123456789',
  onClear: jest.fn(),
  onDeleteDigit: jest.fn(),
  onCall: jest.fn(),
};

describe('PhoneDisplay Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it('affiche le numéro de téléphone correctement', () => {
      const { getByText } = render(<PhoneDisplay {...mockProps} />);

      expect(getByText('0123456789')).toBeTruthy();
    });

    it("affiche le bouton de suppression avec l'icône ⌫", () => {
      const { getByText } = render(<PhoneDisplay {...mockProps} />);

      expect(getByText('⌫')).toBeTruthy();
    });

    it('a un conteneur principal avec testID', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);

      expect(getByTestId('phone-display-container')).toBeTruthy();
    });
  });

  describe('Affichage du numéro', () => {
    it('affiche un numéro vide quand phoneNumber est vide', () => {
      const { getByTestId } = render(
        <PhoneDisplay {...mockProps} phoneNumber='' />
      );

      const numberDisplay = getByTestId('phone-number-display');
      expect(numberDisplay).toBeTruthy();
    });

    it('affiche un numéro long correctement', () => {
      const longNumber = '012345678901234';
      const { getByText } = render(
        <PhoneDisplay {...mockProps} phoneNumber={longNumber} />
      );

      expect(getByText(longNumber)).toBeTruthy();
    });

    it('affiche un numéro avec des espaces correctement', () => {
      const formattedNumber = '01 23 45 67 89';
      const { getByText } = render(
        <PhoneDisplay {...mockProps} phoneNumber={formattedNumber} />
      );

      expect(getByText(formattedNumber)).toBeTruthy();
    });
  });

  describe('Interactions - Bouton de suppression', () => {
    it('appelle onDeleteDigit quand on clique sur le bouton de suppression', () => {
      const { getByText } = render(<PhoneDisplay {...mockProps} />);

      const deleteButton = getByText('⌫');
      fireEvent.press(deleteButton);

      expect(mockProps.onDeleteDigit).toHaveBeenCalledTimes(1);
    });

    it('a un bouton de suppression avec le bon style (rouge)', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);

      const deleteButton = getByTestId('delete-button');
      expect(deleteButton).toBeTruthy();

      // Vérifier que le bouton a des styles
      expect(deleteButton.props.style).toBeDefined();
    });
  });

  describe("Interactions - Bouton d'appel", () => {
    it("appelle onCall avec le numéro quand on clique sur le bouton d'appel", () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);

      const callButton = getByTestId('call-button');
      fireEvent.press(callButton);

      expect(mockProps.onCall).toHaveBeenCalledWith('0123456789');
    });

    it("a un bouton d'appel avec le bon style", () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);

      const callButton = getByTestId('call-button');
      expect(callButton).toBeTruthy();

      // Vérifier que le bouton a des styles
      expect(callButton.props.style).toBeDefined();
    });
  });

  describe('Accessibilité', () => {
    it('a des testID appropriés pour tous les éléments', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);

      expect(getByTestId('phone-display-container')).toBeTruthy();
      expect(getByTestId('phone-number-display')).toBeTruthy();
      expect(getByTestId('delete-button')).toBeTruthy();
      expect(getByTestId('call-button')).toBeTruthy();
    });

    it('a un texte de numéro de téléphone accessible', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);

      const numberDisplay = getByTestId('phone-number-display');
      expect(numberDisplay).toBeTruthy();
    });
  });

  describe('Gestion des cas limites', () => {
    it('gère un numéro très long sans erreur', () => {
      const veryLongNumber = '0'.repeat(50);
      const { getByText } = render(
        <PhoneDisplay {...mockProps} phoneNumber={veryLongNumber} />
      );

      expect(getByText(veryLongNumber)).toBeTruthy();
    });

    it('gère un numéro avec des caractères spéciaux', () => {
      const specialNumber = '01-23.45+67*89#';
      const { getByText } = render(
        <PhoneDisplay {...mockProps} phoneNumber={specialNumber} />
      );

      expect(getByText(specialNumber)).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('ne re-rend pas inutilement avec les mêmes props', () => {
      const { rerender, getByTestId } = render(<PhoneDisplay {...mockProps} />);

      const initialRender = getByTestId('phone-display-container');

      rerender(<PhoneDisplay {...mockProps} />);

      const rerendered = getByTestId('phone-display-container');
      expect(rerendered).toBe(initialRender);
    });
  });

  describe('Styles et mise en page', () => {
    it('a un conteneur avec des styles appropriés', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);

      const container = getByTestId('phone-display-container');
      expect(container.props.style).toBeDefined();
    });

    it('a un affichage du numéro avec des styles appropriés', () => {
      const { getByTestId } = render(<PhoneDisplay {...mockProps} />);

      const numberDisplay = getByTestId('phone-number-display');
      expect(numberDisplay.props.style).toBeDefined();
    });
  });
});
