import React from 'react';
import { render } from '@testing-library/react-native';
import { SystemInfo } from '../../components/SystemInfo';

// Mock des props
const mockProps = {
  networkLevel: 0.8,
  batteryLevel: 0.75,
};

describe('SystemInfo Component - Test Simple', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<SystemInfo {...mockProps} />)).not.toThrow();
  });

  it('affiche quelque chose', () => {
    const { root } = render(<SystemInfo {...mockProps} />);
    expect(root).toBeTruthy();
  });

  it('a des éléments DOM', () => {
    const { root } = render(<SystemInfo {...mockProps} />);
    const domElement = root.children[0];
    expect(domElement).toBeTruthy();
    expect(domElement.children.length).toBeGreaterThan(0);
  });
});
