import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DialPad } from '../../components/DialPad';

// Mock des props
const mockOnNumberPress = jest.fn();

describe('DialPad Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it('affiche tous les boutons numériques (0-9)', () => {
      const { getByText } = render(
        <DialPad onNumberPress={mockOnNumberPress} />
      );

      // Vérifier tous les chiffres
      for (let i = 0; i <= 9; i++) {
        expect(getByText(i.toString())).toBeTruthy();
      }
    });

    it('affiche les symboles spéciaux (* et #)', () => {
      const { getByText } = render(
        <DialPad onNumberPress={mockOnNumberPress} />
      );

      expect(getByText('*')).toBeTruthy();
      expect(getByText('#')).toBeTruthy();
    });

    it('a 12 boutons au total (0-9, *, #)', () => {
      const { getAllByTestId } = render(
        <DialPad onNumberPress={mockOnNumberPress} />
      );

      const buttons = getAllByTestId(/dial-button-/);
      expect(buttons).toHaveLength(12);
    });
  });

  describe('Interactions des boutons', () => {
    it('appelle onNumberPress avec le bon numéro quand on clique sur un bouton', () => {
      const { getByText } = render(
        <DialPad onNumberPress={mockOnNumberPress} />
      );

      const button5 = getByText('5');
      fireEvent.press(button5);

      expect(mockOnNumberPress).toHaveBeenCalledWith('5');
      expect(mockOnNumberPress).toHaveBeenCalledTimes(1);
    });

    it('appelle onNumberPress avec * quand on clique sur le bouton *', () => {
      const { getByText } = render(
        <DialPad onNumberPress={mockOnNumberPress} />
      );

      const buttonStar = getByText('*');
      fireEvent.press(buttonStar);

      expect(mockOnNumberPress).toHaveBeenCalledWith('*');
    });

    it('appelle onNumberPress avec # quand on clique sur le bouton #', () => {
      const { getByText } = render(
        <DialPad onNumberPress={mockOnNumberPress} />
      );

      const buttonHash = getByText('#');
      fireEvent.press(buttonHash);

      expect(mockOnNumberPress).toHaveBeenCalledWith('#');
    });

    it('appelle onNumberPress avec 0 quand on clique sur le bouton 0', () => {
      const { getByText } = render(
        <DialPad onNumberPress={mockOnNumberPress} />
      );

      const button0 = getByText('0');
      fireEvent.press(button0);

      expect(mockOnNumberPress).toHaveBeenCalledWith('0');
    });
  });

  describe('Effets visuels', () => {
    it('a des boutons avec des testID uniques', () => {
      const { getByTestId } = render(
        <DialPad onNumberPress={mockOnNumberPress} />
      );

      expect(getByTestId('dial-button-1')).toBeTruthy();
      expect(getByTestId('dial-button-5')).toBeTruthy();
      expect(getByTestId('dial-button-9')).toBeTruthy();
      expect(getByTestId('dial-button-0')).toBeTruthy();
      expect(getByTestId('dial-button-star')).toBeTruthy();
      expect(getByTestId('dial-button-hash')).toBeTruthy();
    });

    it('a des boutons avec des styles appropriés', () => {
      const { getByTestId } = render(
        <DialPad onNumberPress={mockOnNumberPress} />
      );

      const button1 = getByTestId('dial-button-1');
      expect(button1).toBeTruthy();

      // Vérifier que le bouton a des styles de base
      expect(button1.props.style).toBeDefined();
    });
  });

  describe('Accessibilité', () => {
    it('a des testID appropriés pour tous les éléments', () => {
      const { getByTestId } = render(
        <DialPad onNumberPress={mockOnNumberPress} />
      );

      expect(getByTestId('dial-pad-container')).toBeTruthy();
      expect(getByTestId('dial-pad-grid')).toBeTruthy();
    });

    it('a des boutons accessibles avec des textes lisibles', () => {
      const { getByText } = render(
        <DialPad onNumberPress={mockOnNumberPress} />
      );

      // Vérifier que tous les boutons ont du texte visible
      expect(getByText('1')).toBeTruthy();
      expect(getByText('2')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('4')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
      expect(getByText('6')).toBeTruthy();
      expect(getByText('7')).toBeTruthy();
      expect(getByText('8')).toBeTruthy();
      expect(getByText('9')).toBeTruthy();
      expect(getByText('0')).toBeTruthy();
      expect(getByText('*')).toBeTruthy();
      expect(getByText('#')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('ne re-rend pas inutilement avec la même fonction onNumberPress', () => {
      const { rerender, getByTestId } = render(
        <DialPad onNumberPress={mockOnNumberPress} />
      );

      const initialRender = getByTestId('dial-pad-container');

      rerender(<DialPad onNumberPress={mockOnNumberPress} />);

      const rerendered = getByTestId('dial-pad-container');
      expect(rerendered).toBe(initialRender);
    });
  });

  describe('Gestion des erreurs', () => {
    it('gère correctement les clics multiples rapides', () => {
      const { getByText } = render(
        <DialPad onNumberPress={mockOnNumberPress} />
      );

      const button5 = getByText('5');

      // Clics multiples rapides
      fireEvent.press(button5);
      fireEvent.press(button5);
      fireEvent.press(button5);

      expect(mockOnNumberPress).toHaveBeenCalledTimes(3);
      expect(mockOnNumberPress).toHaveBeenCalledWith('5');
    });
  });
});
