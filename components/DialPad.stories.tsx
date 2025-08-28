import type { Meta, StoryObj } from '@storybook/react-native';
import { DialPad } from './DialPad';

/**
 * Métadonnées du composant DialPad pour Storybook
 * @component DialPad
 * @description Pavé numérique tactile avec retour sonore et interface 3D
 */
const meta: Meta<typeof DialPad> = {
  title: 'Components/DialPad',
  component: DialPad,
  parameters: {
    docs: {
      description: {
        component: `
# Composant DialPad

Pavé numérique tactile avec retour sonore et haptique, optimisé pour les seniors.
Interface intuitive avec des boutons 3D et une taille de police adaptative.

## Fonctionnalités

- **Boutons numériques** 0-9 avec symboles * et #
- **Retour sonore** lors de la pression des boutons
- **Effets visuels 3D** avec ombres et bordures contrastées
- **Taille de police adaptative** selon les dimensions de l'écran
- **Interface responsive** qui s'adapte à tous les écrans
- **Accessibilité** optimisée pour les seniors

## Utilisation

\`\`\`tsx
import { DialPad } from './components/DialPad';

<DialPad onNumberPress={(num) => {
  console.log('Numéro pressé:', num);
  // Logique de composition du numéro
}} />
\`\`\`

## Props

| Prop | Type | Description |
|------|------|-------------|
| onNumberPress | (num: string) => void | Callback appelé quand un bouton est pressé |

## Structure

Le pavé est organisé en 4 rangées :
- Rangée 1: 1, 2, 3
- Rangée 2: 4, 5, 6  
- Rangée 3: 7, 8, 9
- Rangée 4: *, 0, #

## Accessibilité

- Boutons avec testID uniques pour les tests
- Retour sonore pour confirmer la pression
- Contraste élevé pour la lisibilité
- Taille des boutons adaptée aux seniors
        `,
      },
    },
  },
  argTypes: {
    onNumberPress: {
      action: 'numberPressed',
      description: 'Callback appelé quand un bouton numérique est pressé',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Story par défaut du pavé numérique
 */
export const Default: Story = {
  args: {
    onNumberPress: (num: string) => console.log('Numéro pressé:', num),
  },
  parameters: {
    docs: {
      description: {
        story: 'Pavé numérique standard avec tous les boutons 0-9, * et #.',
      },
    },
  },
};

/**
 * Story avec callback personnalisé
 */
export const WithCustomCallback: Story = {
  args: {
    onNumberPress: (num: string) => {
      if (num === '*') {
        console.log('Étoile pressée - Action spéciale');
      } else if (num === '#') {
        console.log('Dièse pressé - Validation');
      } else {
        console.log(`Chiffre ${num} ajouté au numéro`);
      }
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pavé avec callback personnalisé qui gère différemment les symboles et chiffres.',
      },
    },
  },
};

/**
 * Story pour démonstration des interactions
 */
export const InteractiveDemo: Story = {
  args: {
    onNumberPress: (num: string) => {
      // Simulation d'une composition de numéro
      const currentNumber = '012345';
      const newNumber = currentNumber + num;
      console.log(`Numéro composé: ${newNumber}`);

      // Feedback visuel simulé
      if (newNumber.length >= 10) {
        console.log("Numéro complet - Prêt pour l'appel");
      }
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Démonstration interactive simulant la composition d'un numéro de téléphone.",
      },
    },
  },
};
