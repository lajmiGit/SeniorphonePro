import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { VirtualKeyboard } from '../../components/VirtualKeyboard';

// Mock des props
const mockProps = {
  onTextChange: jest.fn(),
  onValidate: jest.fn(),
  onCancel: jest.fn(),
  initialText: '',
  isPhoneNumber: false,
  visible: true,
};

describe('VirtualKeyboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it('affiche le clavier virtuel correctement', () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      expect(getByTestId('virtual-keyboard-container')).toBeTruthy();
      expect(getByTestId('input-field')).toBeTruthy();
      expect(getByTestId('delete-button')).toBeTruthy();
      expect(getByTestId('keyboard-type-selector')).toBeTruthy();
      expect(getByTestId('character-keyboard')).toBeTruthy();
      expect(getByTestId('action-buttons')).toBeTruthy();
    });

    it('affiche le texte initial dans le champ de saisie', () => {
      const propsWithText = { ...mockProps, initialText: 'Test' };
      const { getByTestId } = render(<VirtualKeyboard {...propsWithText} />);
      
      const inputField = getByTestId('input-field');
      expect(inputField.props.value).toBe('Test');
    });

    it('affiche le clavier caractères par défaut', () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      expect(getByTestId('character-keyboard')).toBeTruthy();
      expect(getByTestId('abc-button')).toHaveStyle({ backgroundColor: '#4CAF50' });
    });
  });

  describe('Sélection du type de clavier', () => {
    it('passe au clavier numérique quand on clique sur 123', () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      const button123 = getByTestId('123-button');
      fireEvent.press(button123);
      
      expect(getByTestId('numeric-keyboard')).toBeTruthy();
      expect(button123).toHaveStyle({ backgroundColor: '#4CAF50' });
    });

    it('passe au clavier caractères spéciaux quand on clique sur @#$', () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      const specialButton = getByTestId('special-button');
      fireEvent.press(specialButton);
      
      expect(getByTestId('special-keyboard')).toBeTruthy();
      expect(specialButton).toHaveStyle({ backgroundColor: '#4CAF50' });
    });

    it('revient au clavier caractères quand on clique sur ABC', () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      // D'abord passer au clavier numérique
      fireEvent.press(getByTestId('123-button'));
      
      // Puis revenir aux caractères
      fireEvent.press(getByTestId('abc-button'));
      
      expect(getByTestId('character-keyboard')).toBeTruthy();
      expect(getByTestId('abc-button')).toHaveStyle({ backgroundColor: '#4CAF50' });
    });
  });

  describe('Saisie de texte', () => {
    it('ajoute un caractère quand on appuie sur une touche', () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      const keyA = getByTestId('key-A');
      fireEvent.press(keyA);
      
      expect(mockProps.onTextChange).toHaveBeenCalledWith('A');
    });

    it('ajoute un chiffre quand on appuie sur une touche numérique', () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      // Passer au clavier numérique
      fireEvent.press(getByTestId('123-button'));
      
      const key1 = getByTestId('key-1');
      fireEvent.press(key1);
      
      expect(mockProps.onTextChange).toHaveBeenCalledWith('1');
    });

    it('ajoute un caractère spécial quand on appuie sur une touche spéciale', () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      // Passer au clavier spécial
      fireEvent.press(getByTestId('special-button'));
      
      const keyAt = getByTestId('key-@');
      fireEvent.press(keyAt);
      
      expect(mockProps.onTextChange).toHaveBeenCalledWith('@');
    });

    it('supprime le dernier caractère avec le bouton supprimer', () => {
      const propsWithText = { ...mockProps, initialText: 'Test' };
      const { getByTestId } = render(<VirtualKeyboard {...propsWithText} />);
      
      const deleteButton = getByTestId('delete-button');
      fireEvent.press(deleteButton);
      
      expect(mockProps.onTextChange).toHaveBeenCalledWith('Tes');
    });
  });

  describe('Mode numéro de téléphone', () => {
    it('affiche automatiquement le clavier numérique pour les numéros de téléphone', () => {
      const phoneProps = { ...mockProps, isPhoneNumber: true };
      const { getByTestId } = render(<VirtualKeyboard {...phoneProps} />);
      
      expect(getByTestId('numeric-keyboard')).toBeTruthy();
      expect(getByTestId('123-button')).toHaveStyle({ backgroundColor: '#4CAF50' });
    });

    it('désactive les boutons ABC et @#$ pour les numéros de téléphone', () => {
      const phoneProps = { ...mockProps, isPhoneNumber: true };
      const { getByTestId } = render(<VirtualKeyboard {...phoneProps} />);
      
      const abcButton = getByTestId('abc-button');
      const specialButton = getByTestId('special-button');
      
      expect(abcButton.props.disabled).toBe(true);
      expect(specialButton.props.disabled).toBe(true);
    });
  });

  describe('Actions', () => {
    it('appelle onValidate quand on clique sur Valider', () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      const validateButton = getByTestId('validate-button');
      fireEvent.press(validateButton);
      
      expect(mockProps.onValidate).toHaveBeenCalled();
    });

    it('appelle onCancel quand on clique sur Annuler', () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      const cancelButton = getByTestId('cancel-button');
      fireEvent.press(cancelButton);
      
      expect(mockProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Zoom modal', () => {
    it('affiche le zoom modal quand on clique sur le champ de saisie', async () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      const inputField = getByTestId('input-field');
      fireEvent.press(inputField);
      
      await waitFor(() => {
        expect(getByTestId('text-zoom-modal')).toBeTruthy();
      });
    });

    it('affiche le texte saisi dans le zoom modal', async () => {
      const propsWithText = { ...mockProps, initialText: 'Hello World' };
      const { getByTestId } = render(<VirtualKeyboard {...propsWithText} />);
      
      const inputField = getByTestId('input-field');
      fireEvent.press(inputField);
      
      await waitFor(() => {
        const zoomText = getByTestId('zoom-text-content');
        expect(zoomText.props.children).toBe('Hello World');
      });
    });

    it('ferme le zoom modal quand on clique sur Fermer', async () => {
      const { getByTestId, queryByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      // Ouvrir le zoom
      fireEvent.press(getByTestId('input-field'));
      
      await waitFor(() => {
        expect(getByTestId('text-zoom-modal')).toBeTruthy();
      });
      
      // Fermer le zoom
      const closeButton = getByTestId('close-zoom-button');
      fireEvent.press(closeButton);
      
      await waitFor(() => {
        expect(queryByTestId('text-zoom-modal')).toBeNull();
      });
    });
  });

  describe('Accessibilité', () => {
    it('a des testID appropriés pour tous les éléments', () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      expect(getByTestId('virtual-keyboard-container')).toBeTruthy();
      expect(getByTestId('input-field')).toBeTruthy();
      expect(getByTestId('delete-button')).toBeTruthy();
      expect(getByTestId('keyboard-type-selector')).toBeTruthy();
      expect(getByTestId('character-keyboard')).toBeTruthy();
      expect(getByTestId('action-buttons')).toBeTruthy();
      expect(getByTestId('validate-button')).toBeTruthy();
      expect(getByTestId('cancel-button')).toBeTruthy();
    });

    it('a des boutons accessibles avec des textes lisibles', () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      const validateButton = getByTestId('validate-button');
      const cancelButton = getByTestId('cancel-button');
      
      expect(validateButton.props.accessible).toBe(true);
      expect(cancelButton.props.accessible).toBe(true);
    });
  });

  describe('Gestion des cas limites', () => {
    it('gère un texte très long sans erreur', () => {
      const longText = 'A'.repeat(1000);
      const propsWithLongText = { ...mockProps, initialText: longText };
      
      expect(() => {
        render(<VirtualKeyboard {...propsWithLongText} />);
      }).not.toThrow();
    });

    it('gère un texte vide correctement', () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      const inputField = getByTestId('input-field');
      expect(inputField.props.value).toBe('');
    });

    it('gère la suppression avec un texte vide', () => {
      const { getByTestId } = render(<VirtualKeyboard {...mockProps} />);
      
      const deleteButton = getByTestId('delete-button');
      fireEvent.press(deleteButton);
      
      // Ne devrait pas appeler onTextChange avec un texte vide
      expect(mockProps.onTextChange).not.toHaveBeenCalled();
    });
  });
});
