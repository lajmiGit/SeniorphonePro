import type { Meta, StoryObj } from '@storybook/react-native';
import { PhoneDisplay } from './PhoneDisplay';

/**
 * Métadonnées du composant PhoneDisplay pour Storybook
 * @component PhoneDisplay
 * @description Affichage du numéro de téléphone avec zoom et confirmation d'appel
 */
const meta: Meta<typeof PhoneDisplay> = {
  title: 'Components/PhoneDisplay',
  component: PhoneDisplay,
  parameters: {
    docs: {
      description: {
        component: `
# Composant PhoneDisplay

Affichage du numéro de téléphone composé avec fonctionnalités de zoom, confirmation d'appel 
et synthèse vocale, optimisé pour l'accessibilité seniors.

## Fonctionnalités

- **Affichage du numéro** avec formatage automatique (espaces tous les 2 chiffres)
- **Bouton de suppression** avec icône ⌫ pour effacer le dernier chiffre
- **Modal de zoom** pour visualiser le numéro en grand avec informations détaillées
- **Modal de confirmation** d'appel avec boutons Oui/Non et synthèse vocale
- **Interface responsive** qui s'adapte à tous les écrans
- **Accessibilité** optimisée avec synthèse vocale et contrastes élevés

## Utilisation

\`\`\`tsx
import { PhoneDisplay } from './components/PhoneDisplay';

<PhoneDisplay
  phoneNumber="0123456789"
  onDeleteDigit={() => setPhoneNumber(prev => prev.slice(0, -1))}
  onCall={(num) => {
    console.log('Appel vers:', num);
    // Logique de lancement d'appel
  }}
/>
\`\`\`

## Props

| Prop | Type | Description |
|------|------|-------------|
| phoneNumber | string | Numéro de téléphone à afficher |
| onDeleteDigit | () => void | Callback pour supprimer le dernier chiffre |
| onCall | (phoneNumber: string) => void | Callback pour lancer l'appel |

## Interactions

- **Clic sur le numéro** : Ouvre le modal de zoom
- **Clic sur ⌫** : Supprime le dernier chiffre
- **Clic sur le numéro dans le zoom** : Ouvre la confirmation d'appel
- **Clic sur "Oui"** : Lance l'appel via onCall
- **Clic sur "Non"** : Ferme la confirmation

## Accessibilité

- Synthèse vocale pour lire le numéro
- Boutons avec testID pour les tests
- Contrastes élevés pour la lisibilité
- Icônes intuitives (⌫, 📞)
- Modals avec instructions claires
        `,
      },
    },
  },
  argTypes: {
    phoneNumber: {
      control: { type: 'text' },
      description: 'Numéro de téléphone à afficher',
    },
    onDeleteDigit: {
      action: 'deleteDigit',
      description: 'Callback pour supprimer le dernier chiffre',
    },
    onCall: {
      action: 'call',
      description: "Callback pour lancer l'appel",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Story par défaut avec un numéro de téléphone
 */
export const Default: Story = {
  args: {
    phoneNumber: '0123456789',
    onDeleteDigit: () => console.log('Chiffre supprimé'),
    onCall: (num: string) => console.log('Appel vers:', num),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Affichage standard d'un numéro de téléphone français avec toutes les fonctionnalités.",
      },
    },
  },
};

/**
 * Story avec numéro vide
 */
export const EmptyNumber: Story = {
  args: {
    phoneNumber: '',
    onDeleteDigit: () => console.log('Chiffre supprimé'),
    onCall: (num: string) => console.log('Appel vers:', num),
  },
  parameters: {
    docs: {
      description: {
        story:
          'État initial sans numéro composé - le bouton de suppression est désactivé.',
      },
    },
  },
};

/**
 * Story avec numéro long
 */
export const LongNumber: Story = {
  args: {
    phoneNumber: '012345678901234',
    onDeleteDigit: () => console.log('Chiffre supprimé'),
    onCall: (num: string) => console.log('Appel vers:', num),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Numéro de téléphone long pour tester le formatage et l'affichage.",
      },
    },
  },
};

/**
 * Story avec numéro international
 */
export const InternationalNumber: Story = {
  args: {
    phoneNumber: '+33123456789',
    onDeleteDigit: () => console.log('Chiffre supprimé'),
    onCall: (num: string) => console.log('Appel vers:', num),
  },
  parameters: {
    docs: {
      description: {
        story: 'Numéro de téléphone international avec préfixe pays.',
      },
    },
  },
};

/**
 * Story pour démonstration des interactions
 */
export const InteractiveDemo: Story = {
  args: {
    phoneNumber: '0123456789',
    onDeleteDigit: () => {
      console.log('Chiffre supprimé - Simulation de suppression');
      // Dans un vrai composant, cela modifierait l'état
    },
    onCall: (num: string) => {
      console.log(`Appel confirmé vers ${num}`);
      console.log("Ouverture de l'application téléphone native...");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Démonstration interactive des fonctionnalités de suppression et d'appel.",
      },
    },
  },
};
