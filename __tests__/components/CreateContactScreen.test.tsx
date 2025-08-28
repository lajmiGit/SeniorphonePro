import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CreateContactScreen } from '../../components/CreateContactScreen';

// Mock des props
const mockProps = {
  onContactCreated: jest.fn(),
  onCancel: jest.fn(),
};

describe('CreateContactScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it('affiche l\'écran de création de contact correctement', () => {
      const { getByTestId, getByText } = render(<CreateContactScreen {...mockProps} />);
      
      expect(getByTestId('create-contact-container')).toBeTruthy();
      expect(getByText('Créer un nouveau contact')).toBeTruthy();
      expect(getByTestId('first-name-field')).toBeTruthy();
      expect(getByTestId('last-name-field')).toBeTruthy();
      expect(getByTestId('phone-field')).toBeTruthy();
      expect(getByTestId('photo-field')).toBeTruthy();
      expect(getByTestId('save-button')).toBeTruthy();
      expect(getByTestId('cancel-button')).toBeTruthy();
      expect(getByTestId('home-button')).toBeTruthy();
    });

    it('affiche des champs vides par défaut', () => {
      const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
      
      const firstNameField = getByTestId('first-name-field');
      const lastNameField = getByTestId('last-name-field');
      const phoneField = getByTestId('phone-field');
      const photoField = getByTestId('photo-field');
      
      expect(firstNameField.props.value).toBe('');
      expect(lastNameField.props.value).toBe('');
      expect(phoneField.props.value).toBe('');
      expect(photoField.props.value).toBe('');
    });
  });

  describe('Saisie de données', () => {
    it('met à jour le prénom quand on tape', () => {
      const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
      
      const firstNameField = getByTestId('first-name-field');
      fireEvent.changeText(firstNameField, 'Jean');
      
      expect(firstNameField.props.value).toBe('Jean');
    });

    it('met à jour le nom de famille quand on tape', () => {
      const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
      
      const lastNameField = getByTestId('last-name-field');
      fireEvent.changeText(lastNameField, 'Dupont');
      
      expect(lastNameField.props.value).toBe('Dupont');
    });

    it('met à jour le numéro de téléphone quand on tape', () => {
      const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
      
      const phoneField = getByTestId('phone-field');
      fireEvent.changeText(phoneField, '0123456789');
      
      expect(phoneField.props.value).toBe('0123456789');
    });

    it('met à jour la photo quand on tape', () => {
      const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
      
      const photoField = getByTestId('photo-field');
      fireEvent.changeText(photoField, 'photo.jpg');
      
      expect(photoField.props.value).toBe('photo.jpg');
    });
  });

  describe('Validation des champs', () => {
    it('affiche une erreur si le prénom est vide lors de la sauvegarde', async () => {
      const { getByTestId, getByText } = render(<CreateContactScreen {...mockProps} />);
      
      // Remplir seulement le nom de famille et le téléphone
      fireEvent.changeText(getByTestId('last-name-field'), 'Dupont');
      fireEvent.changeText(getByTestId('phone-field'), '0123456789');
      
      const saveButton = getByTestId('save-button');
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(getByText('Le prénom est requis')).toBeTruthy();
      });
    });

    it('affiche une erreur si le nom de famille est vide lors de la sauvegarde', async () => {
      const { getByTestId, getByText } = render(<CreateContactScreen {...mockProps} />);
      
      // Remplir seulement le prénom et le téléphone
      fireEvent.changeText(getByTestId('first-name-field'), 'Jean');
      fireEvent.changeText(getByTestId('phone-field'), '0123456789');
      
      const saveButton = getByTestId('save-button');
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(getByText('Le nom de famille est requis')).toBeTruthy();
      });
    });

    it('affiche une erreur si le numéro de téléphone est vide lors de la sauvegarde', async () => {
      const { getByTestId, getByText } = render(<CreateContactScreen {...mockProps} />);
      
      // Remplir seulement le prénom et le nom de famille
      fireEvent.changeText(getByTestId('first-name-field'), 'Jean');
      fireEvent.changeText(getByTestId('last-name-field'), 'Dupont');
      
      const saveButton = getByTestId('save-button');
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(getByText('Le numéro de téléphone est requis')).toBeTruthy();
      });
    });

    it('affiche une erreur si le numéro de téléphone est invalide', async () => {
      const { getByTestId, getByText } = render(<CreateContactScreen {...mockProps} />);
      
      // Remplir tous les champs mais avec un téléphone invalide
      fireEvent.changeText(getByTestId('first-name-field'), 'Jean');
      fireEvent.changeText(getByTestId('last-name-field'), 'Dupont');
      fireEvent.changeText(getByTestId('phone-field'), '123');
      
      const saveButton = getByTestId('save-button');
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(getByText('Le numéro de téléphone doit contenir au moins 10 chiffres')).toBeTruthy();
      });
    });
  });

  describe('Sauvegarde réussie', () => {
    it('appelle onContactCreated avec les données du contact quand la validation passe', async () => {
      const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
      
      // Remplir tous les champs
      fireEvent.changeText(getByTestId('first-name-field'), 'Jean');
      fireEvent.changeText(getByTestId('last-name-field'), 'Dupont');
      fireEvent.changeText(getByTestId('phone-field'), '0123456789');
      fireEvent.changeText(getByTestId('photo-field'), 'photo.jpg');
      
      const saveButton = getByTestId('save-button');
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(mockProps.onContactCreated).toHaveBeenCalledWith({
          firstName: 'Jean',
          lastName: 'Dupont',
          phoneNumber: '0123456789',
          photo: 'photo.jpg',
        });
      });
    });

    it('efface les champs après une sauvegarde réussie', async () => {
      const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
      
      // Remplir et sauvegarder
      fireEvent.changeText(getByTestId('first-name-field'), 'Jean');
      fireEvent.changeText(getByTestId('last-name-field'), 'Dupont');
      fireEvent.changeText(getByTestId('phone-field'), '0123456789');
      
      const saveButton = getByTestId('save-button');
      fireEvent.press(saveButton);
      
      await waitFor(() => {
        expect(getByTestId('first-name-field').props.value).toBe('');
        expect(getByTestId('last-name-field').props.value).toBe('');
        expect(getByTestId('phone-field').props.value).toBe('');
        expect(getByTestId('photo-field').props.value).toBe('');
      });
    });
  });

  describe('Actions', () => {
    it('appelle onCancel quand on clique sur Annuler', () => {
      const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
      
      const cancelButton = getByTestId('cancel-button');
      fireEvent.press(cancelButton);
      
      expect(mockProps.onCancel).toHaveBeenCalled();
    });

    it('appelle onCancel quand on clique sur le bouton Accueil', () => {
      const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
      
      const homeButton = getByTestId('home-button');
      fireEvent.press(homeButton);
      
      expect(mockProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Clavier virtuel', () => {
    it('affiche le clavier virtuel quand on clique sur le champ prénom', async () => {
      const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
      
      const firstNameField = getByTestId('first-name-field');
      fireEvent.press(firstNameField);
      
      await waitFor(() => {
        expect(getByTestId('virtual-keyboard')).toBeTruthy();
      });
    });

    it('affiche le clavier virtuel quand on clique sur le champ nom de famille', async () => {
      const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
      
      const lastNameField = getByTestId('last-name-field');
      fireEvent.press(lastNameField);
      
      await waitFor(() => {
        expect(getByTestId('virtual-keyboard')).toBeTruthy();
      });
    });

    it('affiche le clavier téléphone quand on clique sur le champ téléphone', async () => {
      const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
      
      const phoneField = getByTestId('phone-field');
      fireEvent.press(phoneField);
      
      await waitFor(() => {
        expect(getByTestId('virtual-keyboard')).toBeTruthy();
        // Le clavier devrait être en mode téléphone
        expect(getByTestId('numeric-keyboard')).toBeTruthy();
      });
    });
  });

  describe('Accessibilité', () => {
    it('a des testID appropriés pour tous les éléments', () => {
      const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
      
      expect(getByTestId('create-contact-container')).toBeTruthy();
      expect(getByTestId('first-name-field')).toBeTruthy();
      expect(getByTestId('last-name-field')).toBeTruthy();
      expect(getByTestId('phone-field')).toBeTruthy();
      expect(getByTestId('photo-field')).toBeTruthy();
      expect(getByTestId('save-button')).toBeTruthy();
      expect(getByTestId('cancel-button')).toBeTruthy();
      expect(getByTestId('home-button')).toBeTruthy();
    });

    it('a des champs accessibles avec des placeholders lisibles', () => {
      const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
      
      const firstNameField = getByTestId('first-name-field');
      const lastNameField = getByTestId('last-name-field');
      const phoneField = getByTestId('phone-field');
      const photoField = getByTestId('photo-field');
      
      expect(firstNameField.props.accessible).toBe(true);
      expect(lastNameField.props.accessible).toBe(true);
      expect(phoneField.props.accessible).toBe(true);
      expect(photoField.props.accessible).toBe(true);
      
      expect(firstNameField.props.placeholder).toBe('Prénom');
      expect(lastNameField.props.placeholder).toBe('Nom de famille');
      expect(phoneField.props.placeholder).toBe('Numéro de téléphone');
      expect(photoField.props.placeholder).toBe('Photo (optionnel)');
    });
  });

  describe('Gestion des cas limites', () => {
    it('gère un nom très long sans erreur', () => {
      const longName = 'A'.repeat(100);
      
      expect(() => {
        const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
        const firstNameField = getByTestId('first-name-field');
        fireEvent.changeText(firstNameField, longName);
      }).not.toThrow();
    });

    it('gère un numéro de téléphone très long', () => {
      const longPhone = '0'.repeat(20);
      
      expect(() => {
        const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
        const phoneField = getByTestId('phone-field');
        fireEvent.changeText(phoneField, longPhone);
      }).not.toThrow();
    });

    it('gère des caractères spéciaux dans les noms', () => {
      const specialName = 'Jean-Pierre O\'Connor-Smith';
      
      expect(() => {
        const { getByTestId } = render(<CreateContactScreen {...mockProps} />);
        const firstNameField = getByTestId('first-name-field');
        fireEvent.changeText(firstNameField, specialName);
      }).not.toThrow();
    });
  });
});
