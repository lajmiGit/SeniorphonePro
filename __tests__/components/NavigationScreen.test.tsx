import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationScreen } from '../../components/NavigationScreen';

// Mock des props
const mockProps = {
  onNavigate: jest.fn(),
  onHome: jest.fn(),
};

describe('NavigationScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it('affiche l\'écran de navigation correctement', () => {
      const { getByTestId, getByText } = render(<NavigationScreen {...mockProps} />);
      
      expect(getByTestId('navigation-container')).toBeTruthy();
      expect(getByText('Navigation')).toBeTruthy();
      expect(getByTestId('home-button')).toBeTruthy();
    });

    it('affiche tous les boutons de navigation', () => {
      const { getByTestId, getByText } = render(<NavigationScreen {...mockProps} />);
      
      expect(getByTestId('phone-button')).toBeTruthy();
      expect(getByTestId('contacts-button')).toBeTruthy();
      expect(getByTestId('create-contact-button')).toBeTruthy();
      expect(getByTestId('call-button')).toBeTruthy();
      
      expect(getByText('Téléphone')).toBeTruthy();
      expect(getByText('Contacts')).toBeTruthy();
      expect(getByText('Créer Contact')).toBeTruthy();
      expect(getByText('Appeler')).toBeTruthy();
    });
  });

  describe('Navigation vers les écrans', () => {
    it('appelle onNavigate avec "phone" quand on clique sur Téléphone', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const phoneButton = getByTestId('phone-button');
      fireEvent.press(phoneButton);
      
      expect(mockProps.onNavigate).toHaveBeenCalledWith('phone');
    });

    it('appelle onNavigate avec "contacts" quand on clique sur Contacts', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const contactsButton = getByTestId('contacts-button');
      fireEvent.press(contactsButton);
      
      expect(mockProps.onNavigate).toHaveBeenCalledWith('contacts');
    });

    it('appelle onNavigate avec "create-contact" quand on clique sur Créer Contact', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const createContactButton = getByTestId('create-contact-button');
      fireEvent.press(createContactButton);
      
      expect(mockProps.onNavigate).toHaveBeenCalledWith('create-contact');
    });

    it('appelle onNavigate avec "call" quand on clique sur Appeler', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const callButton = getByTestId('call-button');
      fireEvent.press(callButton);
      
      expect(mockProps.onNavigate).toHaveBeenCalledWith('call');
    });
  });

  describe('Bouton Accueil', () => {
    it('appelle onHome quand on clique sur le bouton Accueil', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const homeButton = getByTestId('home-button');
      fireEvent.press(homeButton);
      
      expect(mockProps.onHome).toHaveBeenCalled();
    });
  });

  describe('Accessibilité', () => {
    it('a des testID appropriés pour tous les éléments', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      expect(getByTestId('navigation-container')).toBeTruthy();
      expect(getByTestId('phone-button')).toBeTruthy();
      expect(getByTestId('contacts-button')).toBeTruthy();
      expect(getByTestId('create-contact-button')).toBeTruthy();
      expect(getByTestId('call-button')).toBeTruthy();
      expect(getByTestId('home-button')).toBeTruthy();
    });

    it('a des boutons accessibles avec des textes lisibles', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const phoneButton = getByTestId('phone-button');
      const contactsButton = getByTestId('contacts-button');
      const createContactButton = getByTestId('create-contact-button');
      const callButton = getByTestId('call-button');
      const homeButton = getByTestId('home-button');
      
      expect(phoneButton.props.accessible).toBe(true);
      expect(contactsButton.props.accessible).toBe(true);
      expect(createContactButton.props.accessible).toBe(true);
      expect(callButton.props.accessible).toBe(true);
      expect(homeButton.props.accessible).toBe(true);
    });
  });

  describe('Styles et mise en page', () => {
    it('a des boutons avec des styles appropriés', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const phoneButton = getByTestId('phone-button');
      const contactsButton = getByTestId('contacts-button');
      const createContactButton = getByTestId('create-contact-button');
      const callButton = getByTestId('call-button');
      const homeButton = getByTestId('home-button');
      
      expect(phoneButton.props.style).toBeDefined();
      expect(contactsButton.props.style).toBeDefined();
      expect(createContactButton.props.style).toBeDefined();
      expect(callButton.props.style).toBeDefined();
      expect(homeButton.props.style).toBeDefined();
    });

    it('a un conteneur principal avec des styles appropriés', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const container = getByTestId('navigation-container');
      expect(container.props.style).toBeDefined();
    });
  });

  describe('Interactions utilisateur', () => {
    it('réagit correctement aux pressions multiples sur le bouton Téléphone', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const phoneButton = getByTestId('phone-button');
      
      // Appuyer plusieurs fois
      fireEvent.press(phoneButton);
      fireEvent.press(phoneButton);
      fireEvent.press(phoneButton);
      
      // onNavigate devrait être appelé à chaque fois
      expect(mockProps.onNavigate).toHaveBeenCalledTimes(3);
      expect(mockProps.onNavigate).toHaveBeenCalledWith('phone');
    });

    it('réagit correctement aux pressions multiples sur le bouton Contacts', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const contactsButton = getByTestId('contacts-button');
      
      // Appuyer plusieurs fois
      fireEvent.press(contactsButton);
      fireEvent.press(contactsButton);
      
      // onNavigate devrait être appelé à chaque fois
      expect(mockProps.onNavigate).toHaveBeenCalledTimes(2);
      expect(mockProps.onNavigate).toHaveBeenCalledWith('contacts');
    });

    it('réagit correctement aux pressions multiples sur le bouton Créer Contact', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const createContactButton = getByTestId('create-contact-button');
      
      // Appuyer plusieurs fois
      fireEvent.press(createContactButton);
      fireEvent.press(createContactButton);
      
      // onNavigate devrait être appelé à chaque fois
      expect(mockProps.onNavigate).toHaveBeenCalledTimes(2);
      expect(mockProps.onNavigate).toHaveBeenCalledWith('create-contact');
    });

    it('réagit correctement aux pressions multiples sur le bouton Appeler', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const callButton = getByTestId('call-button');
      
      // Appuyer plusieurs fois
      fireEvent.press(callButton);
      fireEvent.press(callButton);
      
      // onNavigate devrait être appelé à chaque fois
      expect(mockProps.onNavigate).toHaveBeenCalledTimes(2);
      expect(mockProps.onNavigate).toHaveBeenCalledWith('call');
    });

    it('réagit correctement aux pressions multiples sur le bouton Accueil', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const homeButton = getByTestId('home-button');
      
      // Appuyer plusieurs fois
      fireEvent.press(homeButton);
      fireEvent.press(homeButton);
      
      // onHome devrait être appelé à chaque fois
      expect(mockProps.onHome).toHaveBeenCalledTimes(2);
    });
  });

  describe('Gestion des cas limites', () => {
    it('gère les appels multiples de navigation sans erreur', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const phoneButton = getByTestId('phone-button');
      const contactsButton = getByTestId('contacts-button');
      const createContactButton = getByTestId('create-contact-button');
      const callButton = getByTestId('call-button');
      
      // Naviguer vers tous les écrans en séquence
      fireEvent.press(phoneButton);
      fireEvent.press(contactsButton);
      fireEvent.press(createContactButton);
      fireEvent.press(callButton);
      
      expect(mockProps.onNavigate).toHaveBeenCalledTimes(4);
      expect(mockProps.onNavigate).toHaveBeenNthCalledWith(1, 'phone');
      expect(mockProps.onNavigate).toHaveBeenNthCalledWith(2, 'contacts');
      expect(mockProps.onNavigate).toHaveBeenNthCalledWith(3, 'create-contact');
      expect(mockProps.onNavigate).toHaveBeenNthCalledWith(4, 'call');
    });

    it('gère les appels multiples de navigation et d\'accueil sans erreur', () => {
      const { getByTestId } = render(<NavigationScreen {...mockProps} />);
      
      const phoneButton = getByTestId('phone-button');
      const homeButton = getByTestId('home-button');
      
      // Alterner entre navigation et accueil
      fireEvent.press(phoneButton);
      fireEvent.press(homeButton);
      fireEvent.press(phoneButton);
      fireEvent.press(homeButton);
      
      expect(mockProps.onNavigate).toHaveBeenCalledTimes(2);
      expect(mockProps.onHome).toHaveBeenCalledTimes(2);
    });
  });
});
