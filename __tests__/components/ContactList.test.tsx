import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ContactList } from '../../components/ContactList';

// Mock des props
const mockContacts = [
  {
    id: '1',
    name: 'Jean Dupont',
    phoneNumber: '0123456789',
    photo: 'photo1.jpg',
  },
  {
    id: '2',
    name: 'Marie Martin',
    phoneNumber: '0987654321',
    photo: 'photo2.jpg',
  },
  {
    id: '3',
    name: 'Pierre Durand',
    phoneNumber: '0555666777',
    photo: null,
  },
];

const mockProps = {
  contacts: mockContacts,
  onContactPress: jest.fn(),
  onAddContact: jest.fn(),
  onHome: jest.fn(),
};

describe('ContactList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it('affiche la liste des contacts correctement', () => {
      const { getByTestId, getByText } = render(<ContactList {...mockProps} />);
      
      expect(getByTestId('contact-list-container')).toBeTruthy();
      expect(getByText('Contacts')).toBeTruthy();
      expect(getByTestId('add-contact-button')).toBeTruthy();
      expect(getByTestId('home-button')).toBeTruthy();
    });

    it('affiche tous les contacts de la liste', () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      expect(getByText('Jean Dupont')).toBeTruthy();
      expect(getByText('Marie Martin')).toBeTruthy();
      expect(getByText('Pierre Durand')).toBeTruthy();
      expect(getByText('0123456789')).toBeTruthy();
      expect(getByText('0987654321')).toBeTruthy();
      expect(getByText('0555666777')).toBeTruthy();
    });

    it('affiche une photo par défaut pour les contacts sans photo', () => {
      const { getAllByTestId } = render(<ContactList {...mockProps} />);
      
      const contactPhotos = getAllByTestId('contact-photo');
      expect(contactPhotos).toHaveLength(3);
    });
  });

  describe('Interactions avec les contacts', () => {
    it('appelle onContactPress quand on clique sur un contact', () => {
      const { getByTestId } = render(<ContactList {...mockProps} />);
      
      const firstContact = getByTestId('contact-item-1');
      fireEvent.press(firstContact);
      
      expect(mockProps.onContactPress).toHaveBeenCalledWith(mockContacts[0]);
    });

    it('appelle onContactPress pour différents contacts', () => {
      const { getByTestId } = render(<ContactList {...mockProps} />);
      
      const secondContact = getByTestId('contact-item-2');
      fireEvent.press(secondContact);
      
      expect(mockProps.onContactPress).toHaveBeenCalledWith(mockContacts[1]);
    });
  });

  describe('Actions', () => {
    it('appelle onAddContact quand on clique sur le bouton Ajouter', () => {
      const { getByTestId } = render(<ContactList {...mockProps} />);
      
      const addButton = getByTestId('add-contact-button');
      fireEvent.press(addButton);
      
      expect(mockProps.onAddContact).toHaveBeenCalled();
    });

    it('appelle onHome quand on clique sur le bouton Accueil', () => {
      const { getByTestId } = render(<ContactList {...mockProps} />);
      
      const homeButton = getByTestId('home-button');
      fireEvent.press(homeButton);
      
      expect(mockProps.onHome).toHaveBeenCalled();
    });
  });

  describe('Gestion des listes vides', () => {
    it('affiche un message quand la liste est vide', () => {
      const emptyProps = { ...mockProps, contacts: [] };
      const { getByText } = render(<ContactList {...emptyProps} />);
      
      expect(getByText('Aucun contact trouvé')).toBeTruthy();
      expect(getByText('Appuyez sur "Ajouter" pour créer votre premier contact')).toBeTruthy();
    });

    it('affiche toujours le bouton Ajouter même avec une liste vide', () => {
      const emptyProps = { ...mockProps, contacts: [] };
      const { getByTestId } = render(<ContactList {...emptyProps} />);
      
      expect(getByTestId('add-contact-button')).toBeTruthy();
    });
  });

  describe('Accessibilité', () => {
    it('a des testID appropriés pour tous les éléments', () => {
      const { getByTestId } = render(<ContactList {...mockProps} />);
      
      expect(getByTestId('contact-list-container')).toBeTruthy();
      expect(getByTestId('add-contact-button')).toBeTruthy();
      expect(getByTestId('home-button')).toBeTruthy();
      
      // Vérifier les testID des contacts
      expect(getByTestId('contact-item-1')).toBeTruthy();
      expect(getByTestId('contact-item-2')).toBeTruthy();
      expect(getByTestId('contact-item-3')).toBeTruthy();
    });

    it('a des éléments accessibles avec des textes lisibles', () => {
      const { getByTestId } = render(<ContactList {...mockProps} />);
      
      const addButton = getByTestId('add-contact-button');
      const homeButton = getByTestId('home-button');
      
      expect(addButton.props.accessible).toBe(true);
      expect(homeButton.props.accessible).toBe(true);
    });

    it('a des contacts accessibles', () => {
      const { getByTestId } = render(<ContactList {...mockProps} />);
      
      const firstContact = getByTestId('contact-item-1');
      const secondContact = getByTestId('contact-item-2');
      
      expect(firstContact.props.accessible).toBe(true);
      expect(secondContact.props.accessible).toBe(true);
    });
  });

  describe('Gestion des cas limites', () => {
    it('gère une liste avec un seul contact', () => {
      const singleContactProps = { ...mockProps, contacts: [mockContacts[0]] };
      const { getByText, queryByText } = render(<ContactList {...singleContactProps} />);
      
      expect(getByText('Jean Dupont')).toBeTruthy();
      expect(queryByText('Marie Martin')).toBeNull();
      expect(queryByText('Pierre Durand')).toBeNull();
    });

    it('gère une liste avec beaucoup de contacts', () => {
      const manyContacts = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        name: `Contact ${i}`,
        phoneNumber: `0${i.toString().padStart(9, '0')}`,
        photo: null,
      }));
      
      const manyContactsProps = { ...mockProps, contacts: manyContacts };
      
      expect(() => {
        render(<ContactList {...manyContactsProps} />);
      }).not.toThrow();
    });

    it('gère des contacts avec des noms très longs', () => {
      const longNameContact = {
        id: '4',
        name: 'A'.repeat(200),
        phoneNumber: '0123456789',
        photo: null,
      };
      
      const longNameProps = { ...mockProps, contacts: [...mockContacts, longNameContact] };
      
      expect(() => {
        render(<ContactList {...longNameProps} />);
      }).not.toThrow();
    });

    it('gère des contacts avec des numéros de téléphone très longs', () => {
      const longPhoneContact = {
        id: '4',
        name: 'Contact Test',
        phoneNumber: '0'.repeat(50),
        photo: null,
      };
      
      const longPhoneProps = { ...mockProps, contacts: [...mockContacts, longPhoneContact] };
      
      expect(() => {
        render(<ContactList {...longPhoneProps} />);
      }).not.toThrow();
    });
  });

  describe('Styles et mise en page', () => {
    it('a un bouton d\'ajout avec le bon style', () => {
      const { getByTestId } = render(<ContactList {...mockProps} />);
      
      const addButton = getByTestId('add-contact-button');
      expect(addButton).toBeTruthy();
      
      // Vérifier que le bouton a des styles appropriés
      expect(addButton.props.style).toBeDefined();
    });

    it('a un bouton d\'accueil avec le bon style', () => {
      const { getByTestId } = render(<ContactList {...mockProps} />);
      
      const homeButton = getByTestId('home-button');
      expect(homeButton).toBeTruthy();
      
      // Vérifier que le bouton a des styles appropriés
      expect(homeButton.props.style).toBeDefined();
    });

    it('a des éléments de contact avec des styles appropriés', () => {
      const { getByTestId } = render(<ContactList {...mockProps} />);
      
      const firstContact = getByTestId('contact-item-1');
      expect(firstContact).toBeTruthy();
      
      // Vérifier que l'élément a des styles appropriés
      expect(firstContact.props.style).toBeDefined();
    });
  });

  describe('Interactions utilisateur', () => {
    it('réagit correctement aux pressions multiples sur le bouton d\'ajout', () => {
      const { getByTestId } = render(<ContactList {...mockProps} />);
      
      const addButton = getByTestId('add-contact-button');
      
      // Appuyer plusieurs fois
      fireEvent.press(addButton);
      fireEvent.press(addButton);
      fireEvent.press(addButton);
      
      // onAddContact devrait être appelé à chaque fois
      expect(mockProps.onAddContact).toHaveBeenCalledTimes(3);
    });

    it('réagit correctement aux pressions multiples sur le bouton d\'accueil', () => {
      const { getByTestId } = render(<ContactList {...mockProps} />);
      
      const homeButton = getByTestId('home-button');
      
      // Appuyer plusieurs fois
      fireEvent.press(homeButton);
      fireEvent.press(homeButton);
      
      // onHome devrait être appelé à chaque fois
      expect(mockProps.onHome).toHaveBeenCalledTimes(2);
    });

    it('réagit correctement aux pressions multiples sur un contact', () => {
      const { getByTestId } = render(<ContactList {...mockProps} />);
      
      const firstContact = getByTestId('contact-item-1');
      
      // Appuyer plusieurs fois
      fireEvent.press(firstContact);
      fireEvent.press(firstContact);
      
      // onContactPress devrait être appelé à chaque fois
      expect(mockProps.onContactPress).toHaveBeenCalledTimes(2);
    });
  });
});
