import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CallScreen } from '../../components/CallScreen';

// Mock des props
const mockProps = {
  contact: {
    id: '1',
    name: 'Jean Dupont',
    phoneNumber: '0123456789',
    photo: 'photo.jpg',
  },
  onCall: jest.fn(),
  onCancel: jest.fn(),
  onHome: jest.fn(),
};

describe('CallScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it('affiche l\'écran d\'appel correctement', () => {
      const { getByTestId, getByText } = render(<CallScreen {...mockProps} />);
      
      expect(getByTestId('call-screen-container')).toBeTruthy();
      expect(getByText('Jean Dupont')).toBeTruthy();
      expect(getByText('0123456789')).toBeTruthy();
      expect(getByTestId('contact-photo')).toBeTruthy();
      expect(getByTestId('call-button')).toBeTruthy();
      expect(getByTestId('cancel-button')).toBeTruthy();
      expect(getByTestId('home-button')).toBeTruthy();
    });

    it('affiche les informations du contact correctement', () => {
      const { getByText } = render(<CallScreen {...mockProps} />);
      
      expect(getByText('Jean Dupont')).toBeTruthy();
      expect(getByText('0123456789')).toBeTruthy();
    });

    it('affiche une photo par défaut si aucune photo n\'est fournie', () => {
      const propsWithoutPhoto = {
        ...mockProps,
        contact: { ...mockProps.contact, photo: null },
      };
      
      const { getByTestId } = render(<CallScreen {...propsWithoutPhoto} />);
      expect(getByTestId('contact-photo')).toBeTruthy();
    });
  });

  describe('Actions', () => {
    it('appelle onCall avec le contact quand on clique sur Appeler', () => {
      const { getByTestId } = render(<CallScreen {...mockProps} />);
      
      const callButton = getByTestId('call-button');
      fireEvent.press(callButton);
      
      expect(mockProps.onCall).toHaveBeenCalledWith(mockProps.contact);
    });

    it('appelle onCancel quand on clique sur Annuler', () => {
      const { getByTestId } = render(<CallScreen {...mockProps} />);
      
      const cancelButton = getByTestId('cancel-button');
      fireEvent.press(cancelButton);
      
      expect(mockProps.onCancel).toHaveBeenCalled();
    });

    it('appelle onHome quand on clique sur le bouton Accueil', () => {
      const { getByTestId } = render(<CallScreen {...mockProps} />);
      
      const homeButton = getByTestId('home-button');
      fireEvent.press(homeButton);
      
      expect(mockProps.onHome).toHaveBeenCalled();
    });
  });

  describe('Accessibilité', () => {
    it('a des testID appropriés pour tous les éléments', () => {
      const { getByTestId } = render(<CallScreen {...mockProps} />);
      
      expect(getByTestId('call-screen-container')).toBeTruthy();
      expect(getByTestId('contact-photo')).toBeTruthy();
      expect(getByTestId('call-button')).toBeTruthy();
      expect(getByTestId('cancel-button')).toBeTruthy();
      expect(getByTestId('home-button')).toBeTruthy();
    });

    it('a des boutons accessibles avec des textes lisibles', () => {
      const { getByTestId } = render(<CallScreen {...mockProps} />);
      
      const callButton = getByTestId('call-button');
      const cancelButton = getByTestId('cancel-button');
      const homeButton = getByTestId('home-button');
      
      expect(callButton.props.accessible).toBe(true);
      expect(cancelButton.props.accessible).toBe(true);
      expect(homeButton.props.accessible).toBe(true);
    });
  });

  describe('Gestion des cas limites', () => {
    it('gère un nom de contact très long', () => {
      const longName = 'A'.repeat(100);
      const propsWithLongName = {
        ...mockProps,
        contact: { ...mockProps.contact, name: longName },
      };
      
      expect(() => {
        render(<CallScreen {...propsWithLongName} />);
      }).not.toThrow();
    });

    it('gère un numéro de téléphone très long', () => {
      const longPhone = '0'.repeat(20);
      const propsWithLongPhone = {
        ...mockProps,
        contact: { ...mockProps.contact, phoneNumber: longPhone },
      };
      
      expect(() => {
        render(<CallScreen {...propsWithLongPhone} />);
      }).not.toThrow();
    });

    it('gère un contact sans nom', () => {
      const propsWithoutName = {
        ...mockProps,
        contact: { ...mockProps.contact, name: '' },
      };
      
      expect(() => {
        render(<CallScreen {...propsWithoutName} />);
      }).not.toThrow();
    });

    it('gère un contact sans numéro de téléphone', () => {
      const propsWithoutPhone = {
        ...mockProps,
        contact: { ...mockProps.contact, phoneNumber: '' },
      };
      
      expect(() => {
        render(<CallScreen {...propsWithoutPhone} />);
      }).not.toThrow();
    });
  });

  describe('Styles et mise en page', () => {
    it('a un bouton d\'appel avec le bon style', () => {
      const { getByTestId } = render(<CallScreen {...mockProps} />);
      
      const callButton = getByTestId('call-button');
      expect(callButton).toBeTruthy();
      
      // Vérifier que le bouton a des styles appropriés
      expect(callButton.props.style).toBeDefined();
    });

    it('a un bouton d\'annulation avec le bon style', () => {
      const { getByTestId } = render(<CallScreen {...mockProps} />);
      
      const cancelButton = getByTestId('cancel-button');
      expect(cancelButton).toBeTruthy();
      
      // Vérifier que le bouton a des styles appropriés
      expect(cancelButton.props.style).toBeDefined();
    });

    it('a un bouton d\'accueil avec le bon style', () => {
      const { getByTestId } = render(<CallScreen {...mockProps} />);
      
      const homeButton = getByTestId('home-button');
      expect(homeButton).toBeTruthy();
      
      // Vérifier que le bouton a des styles appropriés
      expect(homeButton.props.style).toBeDefined();
    });
  });

  describe('Interactions utilisateur', () => {
    it('réagit correctement aux pressions multiples sur le bouton d\'appel', () => {
      const { getByTestId } = render(<CallScreen {...mockProps} />);
      
      const callButton = getByTestId('call-button');
      
      // Appuyer plusieurs fois
      fireEvent.press(callButton);
      fireEvent.press(callButton);
      fireEvent.press(callButton);
      
      // onCall devrait être appelé à chaque fois
      expect(mockProps.onCall).toHaveBeenCalledTimes(3);
    });

    it('réagit correctement aux pressions multiples sur le bouton d\'annulation', () => {
      const { getByTestId } = render(<CallScreen {...mockProps} />);
      
      const cancelButton = getByTestId('cancel-button');
      
      // Appuyer plusieurs fois
      fireEvent.press(cancelButton);
      fireEvent.press(cancelButton);
      
      // onCancel devrait être appelé à chaque fois
      expect(mockProps.onCancel).toHaveBeenCalledTimes(2);
    });

    it('réagit correctement aux pressions multiples sur le bouton d\'accueil', () => {
      const { getByTestId } = render(<CallScreen {...mockProps} />);
      
      const homeButton = getByTestId('home-button');
      
      // Appuyer plusieurs fois
      fireEvent.press(homeButton);
      fireEvent.press(homeButton);
      
      // onHome devrait être appelé à chaque fois
      expect(mockProps.onHome).toHaveBeenCalledTimes(2);
    });
  });
});
