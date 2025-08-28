import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { LoadingSpinner } from '../../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  test('affiche le message de chargement par défaut', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  test('affiche le message personnalisé', () => {
    const customMessage = 'Veuillez patienter...';
    render(<LoadingSpinner message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test("affiche l'indicateur de chargement", () => {
    render(<LoadingSpinner />);

    // Vérifie que l'ActivityIndicator est présent
    const activityIndicator = screen.getByTestId('loading-spinner');
    expect(activityIndicator).toBeInTheDocument();
  });

  test('a le bon style de conteneur', () => {
    const { getByTestId } = render(<LoadingSpinner />);

    const container = getByTestId('loading-container');
    expect(container).toHaveStyle({
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5F5F5',
    });
  });
});
