import type { Meta, StoryObj } from '@storybook/react-native';
import { SystemInfo } from './SystemInfo';

/**
 * Métadonnées du composant SystemInfo pour Storybook
 * @component SystemInfo
 * @description Composant d'affichage des informations système avec zooms interactifs
 */
const meta: Meta<typeof SystemInfo> = {
  title: 'Components/SystemInfo',
  component: SystemInfo,
  parameters: {
    docs: {
      description: {
        component: `
# Composant SystemInfo

Affiche les informations système essentielles (réseau, batterie, heure) avec une interface 
optimisée pour les seniors et des fonctionnalités d'accessibilité avancées.

## Fonctionnalités

- **Affichage temps réel** de l'heure avec mise à jour automatique
- **Indicateurs visuels 3D** pour le niveau de réseau et de batterie
- **Modals de zoom** avec informations détaillées et synthèse vocale
- **Optimisations de performance** avec React.memo, useCallback et useMemo
- **Interface senior-friendly** avec couleurs contrastées et textes lisibles

## Utilisation

\`\`\`tsx
import { SystemInfo } from './components/SystemInfo';

<SystemInfo 
  networkLevel={4} 
  batteryLevel={75} 
/>
\`\`\`

## Props

| Prop | Type | Défaut | Description |
|------|------|---------|-------------|
| networkLevel | number | 4 | Niveau de signal réseau (0-5) |
| batteryLevel | number | 85 | Niveau de batterie (0-100) |
        `,
      },
    },
  },
  argTypes: {
    networkLevel: {
      control: { type: 'range', min: 0, max: 5, step: 1 },
      description:
        'Niveau de signal réseau (0 = aucun signal, 5 = signal excellent)',
    },
    batteryLevel: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Niveau de batterie en pourcentage (0 = vide, 100 = pleine)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Story par défaut avec des valeurs moyennes
 */
export const Default: Story = {
  args: {
    networkLevel: 4,
    batteryLevel: 75,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Affichage standard avec un bon signal réseau et une batterie à 75%.',
      },
    },
  },
};

/**
 * Story avec signal réseau faible
 */
export const WeakNetwork: Story = {
  args: {
    networkLevel: 1,
    batteryLevel: 75,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Affichage avec un signal réseau faible (niveau 1) et une batterie normale.',
      },
    },
  },
};

/**
 * Story avec batterie faible
 */
export const LowBattery: Story = {
  args: {
    networkLevel: 4,
    batteryLevel: 15,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Affichage avec un bon signal réseau mais une batterie faible (15%).',
      },
    },
  },
};

/**
 * Story avec signal excellent et batterie pleine
 */
export const ExcellentSignal: Story = {
  args: {
    networkLevel: 5,
    batteryLevel: 100,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Affichage optimal avec un signal excellent (niveau 5) et une batterie pleine.',
      },
    },
  },
};

/**
 * Story avec signal nul et batterie critique
 */
export const CriticalState: Story = {
  args: {
    networkLevel: 0,
    batteryLevel: 5,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Affichage en état critique : aucun signal réseau et batterie presque vide.',
      },
    },
  },
};
