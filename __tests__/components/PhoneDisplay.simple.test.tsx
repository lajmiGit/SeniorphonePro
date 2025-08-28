import React from 'react';
import { render } from '@testing-library/react-native';
import { PhoneDisplay } from '../../components/PhoneDisplay';

// Mock des props
const mockProps = {
  phoneNumber: '0123456789',
  onClear: jest.fn(),
  onDeleteDigit: jest.fn(),
  onCall: jest.fn(),
};

describe('PhoneDisplay Component - Test Simple', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('se rend sans erreur', () => {
    expect(() => render(<PhoneDisplay {...mockProps} />)).not.toThrow();
  });

  it('affiche quelque chose', () => {
    const { root } = render(<PhoneDisplay {...mockProps} />);
    expect(root).toBeTruthy();
  });

  it('a des éléments DOM', () => {
    const { root } = render(<PhoneDisplay {...mockProps} />);
    const domElement = root.children[0];
    expect(domElement).toBeTruthy();
    expect(domElement.children.length).toBeGreaterThan(0);
  });
});
