import React from 'react';
import { render } from '@testing-library/react-native';
import { DialPad } from '../../components/DialPad';

// Mock des props
const mockOnNumberPress = jest.fn();

describe('DialPad Component - Test Simple', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('se rend sans erreur', () => {
    expect(() =>
      render(<DialPad onNumberPress={mockOnNumberPress} />)
    ).not.toThrow();
  });

  it('affiche quelque chose', () => {
    const { root } = render(<DialPad onNumberPress={mockOnNumberPress} />);
    expect(root).toBeTruthy();
  });

  it('a des éléments DOM', () => {
    const { root } = render(<DialPad onNumberPress={mockOnNumberPress} />);
    const domElement = root.children[0];
    expect(domElement).toBeTruthy();
    expect(domElement.children.length).toBeGreaterThan(0);
  });
});
