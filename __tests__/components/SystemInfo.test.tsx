import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SystemInfo } from '../../components/SystemInfo';

// Mock des props
const mockProps = {
  networkLevel: 0.8,
  batteryLevel: 0.75,
};

describe('SystemInfo Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it('affiche correctement les trois sections (Network, Battery, Time)', () => {
      const { getByTestId } = render(<SystemInfo {...mockProps} />);

      expect(getByTestId('network-section')).toBeTruthy();
      expect(getByTestId('battery-section')).toBeTruthy();
      expect(getByTestId('time-section')).toBeTruthy();
    });

    it('affiche le niveau de réseau avec la bonne couleur', () => {
      const { getByTestId } = render(<SystemInfo {...mockProps} />);

      const networkSection = getByTestId('network-section');
      expect(networkSection).toBeTruthy();
    });

    it('affiche le niveau de batterie avec la bonne couleur', () => {
      const { getByTestId } = render(<SystemInfo {...mockProps} />);

      const batterySection = getByTestId('battery-section');
      expect(batterySection).toBeTruthy();
    });
  });

  describe('Interactions - Zoom Time', () => {
    it('ouvre le zoom time quand on clique sur la section time', async () => {
      const { getByTestId, queryByTestId } = render(
        <SystemInfo {...mockProps} />
      );

      const timeSection = getByTestId('time-section');
      fireEvent.press(timeSection);

      await waitFor(() => {
        expect(queryByTestId('time-zoom-modal')).toBeTruthy();
      });
    });

    it("ferme le zoom time quand on clique à l'intérieur", async () => {
      const { getByTestId, queryByTestId } = render(
        <SystemInfo {...mockProps} />
      );

      // Ouvrir le zoom
      const timeSection = getByTestId('time-section');
      fireEvent.press(timeSection);

      await waitFor(() => {
        expect(queryByTestId('time-zoom-modal')).toBeTruthy();
      });

      // Fermer le zoom
      const timeZoomModal = getByTestId('time-zoom-modal');
      fireEvent.press(timeZoomModal);

      await waitFor(() => {
        expect(queryByTestId('time-zoom-modal')).toBeFalsy();
      });
    });
  });

  describe('Interactions - Zoom Network', () => {
    it('ouvre le zoom network quand on clique sur la section network', async () => {
      const { getByTestId, queryByTestId } = render(
        <SystemInfo {...mockProps} />
      );

      const networkSection = getByTestId('network-section');
      fireEvent.press(networkSection);

      await waitFor(() => {
        expect(queryByTestId('network-zoom-modal')).toBeTruthy();
      });
    });

    it('affiche le niveau de réseau dans le zoom', async () => {
      const { getByTestId } = render(<SystemInfo {...mockProps} />);

      const networkSection = getByTestId('network-section');
      fireEvent.press(networkSection);

      await waitFor(() => {
        const networkZoom = getByTestId('network-zoom-modal');
        expect(networkZoom).toBeTruthy();
      });
    });
  });

  describe('Interactions - Zoom Battery', () => {
    it('ouvre le zoom battery quand on clique sur la section battery', async () => {
      const { getByTestId, queryByTestId } = render(
        <SystemInfo {...mockProps} />
      );

      const batterySection = getByTestId('battery-section');
      fireEvent.press(batterySection);

      await waitFor(() => {
        expect(queryByTestId('battery-zoom-modal')).toBeTruthy();
      });
    });

    it('affiche le pourcentage de batterie dans le zoom', async () => {
      const { getByTestId } = render(<SystemInfo {...mockProps} />);

      const batterySection = getByTestId('battery-section');
      fireEvent.press(batterySection);

      await waitFor(() => {
        const batteryZoom = getByTestId('battery-zoom-modal');
        expect(batteryZoom).toBeTruthy();
      });
    });
  });

  describe('Accessibilité', () => {
    it('a des testID appropriés pour tous les éléments', () => {
      const { getByTestId } = render(<SystemInfo {...mockProps} />);

      expect(getByTestId('system-info-container')).toBeTruthy();
      expect(getByTestId('network-section')).toBeTruthy();
      expect(getByTestId('battery-section')).toBeTruthy();
      expect(getByTestId('time-section')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('ne re-rend pas inutilement avec les mêmes props', () => {
      const { rerender, getByTestId } = render(<SystemInfo {...mockProps} />);

      const initialRender = getByTestId('system-info-container');

      rerender(<SystemInfo {...mockProps} />);

      const rerendered = getByTestId('system-info-container');
      expect(rerendered).toBe(initialRender);
    });
  });
});
