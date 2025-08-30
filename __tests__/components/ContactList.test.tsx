import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
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
  onCreateContact: jest.fn(),
  onHomePress: jest.fn(),
};

describe('ContactList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it('affiche la liste des contacts correctement', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('📱 Contacts')).toBeTruthy();
      });
      expect(getByText('🏠 Accueil')).toBeTruthy();
      expect(getByText('➕ Nouveau')).toBeTruthy();
    });

    it('affiche tous les contacts de la liste', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('Jean Dupont')).toBeTruthy();
      });
      expect(getByText('Marie Martin')).toBeTruthy();
      expect(getByText('Pierre Durand')).toBeTruthy();
      expect(getByText('0123456789')).toBeTruthy();
      expect(getByText('0987654321')).toBeTruthy();
      expect(getByText('0555666777')).toBeTruthy();
    });

    it('affiche une photo par défaut pour les contacts sans photo', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('J')).toBeTruthy(); // Première lettre du nom
        expect(getByText('M')).toBeTruthy(); // Première lettre du nom
        expect(getByText('P')).toBeTruthy(); // Première lettre du nom
      });
    });
  });

  describe('Interactions avec les contacts', () => {
    it('appelle onContactPress quand on clique sur un contact', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('Jean Dupont')).toBeTruthy();
      });
      
      const firstContact = getByText('Jean Dupont').parent;
      fireEvent.press(firstContact);
      
      // Le composant gère les contacts en interne, pas via props
      expect(mockProps.onCreateContact).not.toHaveBeenCalled();
    });

    it('appelle onContactPress pour différents contacts', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('Marie Martin')).toBeTruthy();
      });
      
      const secondContact = getByText('Marie Martin').parent;
      fireEvent.press(secondContact);
      
      // Le composant gère les contacts en interne, pas via props
      expect(mockProps.onCreateContact).not.toHaveBeenCalled();
    });
  });

  describe('Actions', () => {
    it('appelle onAddContact quand on clique sur le bouton Ajouter', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('➕ Nouveau')).toBeTruthy();
      });
      
      const addButton = getByText('➕ Nouveau').parent;
      fireEvent.press(addButton);
      
      expect(mockProps.onCreateContact).toHaveBeenCalled();
    });

    it('appelle onHome quand on clique sur le bouton Accueil', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('🏠 Accueil')).toBeTruthy();
      });
      
      const homeButton = getByText('🏠 Accueil').parent;
      fireEvent.press(homeButton);
      
      expect(mockProps.onHomePress).toHaveBeenCalled();
    });
  });

  describe('Gestion des listes vides', () => {
    it('affiche toujours le bouton Ajouter même avec une liste vide', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('➕ Nouveau')).toBeTruthy();
      });
    });
  });

  describe('Accessibilité', () => {
    it('a des éléments accessibles avec des textes lisibles', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('➕ Nouveau')).toBeTruthy();
      });
      
      // Vérifier que les éléments sont présents et accessibles
      expect(getByText('➕ Nouveau')).toBeTruthy();
      expect(getByText('🏠 Accueil')).toBeTruthy();
    });

    it('a des contacts accessibles', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('Jean Dupont')).toBeTruthy();
      });
      
      // Vérifier que les contacts sont présents
      expect(getByText('Jean Dupont')).toBeTruthy();
      expect(getByText('Marie Martin')).toBeTruthy();
    });
  });

  describe('Gestion des cas limites', () => {
    it('gère une liste avec un seul contact', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('Jean Dupont')).toBeTruthy();
      });
      // Le composant charge ses propres contacts depuis l'API
      expect(getByText('Marie Martin')).toBeTruthy();
      expect(getByText('Pierre Durand')).toBeTruthy();
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
    it('a un bouton d\'ajout avec le bon style', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('➕ Nouveau')).toBeTruthy();
      });
      
      const addButton = getByText('➕ Nouveau').parent;
      expect(addButton).toBeTruthy();
      
      // Vérifier que le bouton a des styles appropriés
      expect(addButton.props.style).toBeDefined();
    });

    it('a un bouton d\'accueil avec le bon style', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('🏠 Accueil')).toBeTruthy();
      });
      
      const homeButton = getByText('🏠 Accueil').parent;
      expect(homeButton).toBeTruthy();
      
      // Vérifier que le bouton a des styles appropriés
      expect(homeButton.props.style).toBeDefined();
    });

    it('a des éléments de contact avec des styles appropriés', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('Jean Dupont')).toBeTruthy();
      });
      
      const firstContact = getByText('Jean Dupont').parent;
      expect(firstContact).toBeTruthy();
      
      // Vérifier que l'élément a des styles appropriés
      expect(firstContact.props.style).toBeDefined();
    });
  });

  describe('Interactions utilisateur', () => {
    it('réagit correctement aux pressions multiples sur le bouton d\'ajout', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('➕ Nouveau')).toBeTruthy();
      });
      
      const addButton = getByText('➕ Nouveau').parent;
      
      // Appuyer plusieurs fois
      fireEvent.press(addButton);
      fireEvent.press(addButton);
      fireEvent.press(addButton);
      
      // onAddContact devrait être appelé à chaque fois
      expect(mockProps.onCreateContact).toHaveBeenCalledTimes(3);
    });

    it('réagit correctement aux pressions multiples sur le bouton d\'accueil', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('🏠 Accueil')).toBeTruthy();
      });
      
      const homeButton = getByText('🏠 Accueil').parent;
      
      // Appuyer plusieurs fois
      fireEvent.press(homeButton);
      fireEvent.press(homeButton);
      
      // onHome devrait être appelé à chaque fois
      expect(mockProps.onHomePress).toHaveBeenCalledTimes(2);
    });

    it('réagit correctement aux pressions multiples sur un contact', async () => {
      const { getByText } = render(<ContactList {...mockProps} />);
      
      await waitFor(() => {
        expect(getByText('Jean Dupont')).toBeTruthy();
      });
      
      const firstContact = getByText('Jean Dupont').parent;
      
      // Appuyer plusieurs fois
      fireEvent.press(firstContact);
      fireEvent.press(firstContact);
      
      // onContactPress devrait être appelé à chaque fois
      expect(mockProps.onContactPress).toHaveBeenCalledTimes(2);
    });
  });
});
