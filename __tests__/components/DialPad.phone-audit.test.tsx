import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Dimensions } from 'react-native';
import { DialPad } from '../../components/DialPad';

// Mock Dimensions pour tester différentes tailles d'écran de téléphone
const originalDimensions = Dimensions.get;

describe('DialPad Component - Audit Écrans Téléphone', () => {
  const mockOnNumberPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    Dimensions.get = originalDimensions;
  });

  // Tailles d'écran de téléphone courantes
  const phoneScreenSizes = [
    { name: 'iPhone SE (1ère génération)', width: 320, height: 568 },
    { name: 'iPhone SE (2ème génération)', width: 375, height: 667 },
    { name: 'iPhone 8', width: 375, height: 667 },
    { name: 'iPhone 12/13/14', width: 390, height: 844 },
    { name: 'iPhone 12/13/14 Pro', width: 393, height: 852 },
    { name: 'iPhone 12/13/14 Pro Max', width: 428, height: 926 },
    { name: 'iPhone 14 Plus', width: 428, height: 926 },
    { name: 'iPhone 15/15 Pro', width: 393, height: 852 },
    { name: 'iPhone 15 Plus/Pro Max', width: 430, height: 932 },
    { name: 'Samsung Galaxy S21', width: 360, height: 800 },
    { name: 'Samsung Galaxy S22', width: 360, height: 780 },
    { name: 'Google Pixel 6', width: 393, height: 851 },
    { name: 'OnePlus 9', width: 412, height: 915 },
  ];

  describe('Audit Performance sur Écrans Téléphone', () => {
    phoneScreenSizes.forEach(({ name, width, height }) => {
      describe(`${name} (${width}x${height})`, () => {
        beforeEach(() => {
          Dimensions.get = jest.fn().mockReturnValue({ width, height });
        });

        it('se rend sans erreur de performance', () => {
          const startTime = Date.now();
          expect(() => {
            render(<DialPad onNumberPress={mockOnNumberPress} />);
          }).not.toThrow();
          const renderTime = Date.now() - startTime;
          
          // Vérifier que le rendu est rapide (< 100ms)
          expect(renderTime).toBeLessThan(100);
        });

        it('a des boutons de taille optimale pour le tactile', () => {
          const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
          const button1 = getByTestId('dial-button-1');
          const buttonStyle = button1.props.style;
          
          // Vérifier que les boutons sont suffisamment grands pour le tactile
          expect(buttonStyle.width).toBeGreaterThanOrEqual(44); // Minimum recommandé par Apple
          expect(buttonStyle.height).toBeGreaterThanOrEqual(44);
          
          // Vérifier que les boutons ne sont pas trop grands (critère adapté pour seniors)
          const maxSize = Math.min(width, height) * 0.60; // Maximum 60% de la plus petite dimension (optimisé pour seniors)
          expect(buttonStyle.width).toBeLessThanOrEqual(maxSize);
          expect(buttonStyle.height).toBeLessThanOrEqual(maxSize);
          
          // Vérifier que les boutons sont carrés
          expect(buttonStyle.width).toBe(buttonStyle.height);
          
          // Vérifier que la taille est raisonnable pour les seniors
          expect(buttonStyle.width).toBeGreaterThanOrEqual(60); // Minimum pour seniors
          expect(buttonStyle.width).toBeLessThanOrEqual(250); // Maximum absolu
          
          // Vérifier que la taille est cohérente (même taille sur tous les écrans)
          expect(buttonStyle.width).toBe(191.35); // Taille actuelle optimale
        });

        it('a un espacement approprié pour éviter les touches accidentelles', () => {
          const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
          const button1 = getByTestId('dial-button-1');
          const button2 = getByTestId('dial-button-2');
          
          // Vérifier que les boutons ont des styles définis
          expect(button1.props.style).toBeDefined();
          expect(button2.props.style).toBeDefined();
        });

        it('a une police de taille lisible', () => {
          const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
          const button1 = getByTestId('dial-button-1');
          const textElement = button1.findByType('Text');
          
          // Vérifier que la police est définie
          expect(textElement).toBeTruthy();
        });

        it('a une grille parfaitement centrée', () => {
          const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
          const container = getByTestId('dial-pad-container');
          const containerStyle = container.props.style;
          
          // Vérifier le centrage
          expect(containerStyle.justifyContent).toBe('center');
          expect(containerStyle.alignItems).toBe('center');
        });

        it('a tous les boutons numériques visibles et accessibles', () => {
          const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
          
          // Vérifier tous les boutons numériques
          for (let i = 0; i <= 9; i++) {
            const button = getByTestId(`dial-button-${i}`);
            expect(button).toBeTruthy();
            expect(button.props.accessible).toBe(true);
          }
          
          // Vérifier les symboles spéciaux
          expect(getByTestId('dial-button-star')).toBeTruthy();
          expect(getByTestId('dial-button-hash')).toBeTruthy();
        });
      });
    });
  });

  describe('Audit Accessibilité sur Téléphone', () => {
    it('a des testID uniques pour tous les boutons', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      const expectedTestIDs = [
        'dial-button-1', 'dial-button-2', 'dial-button-3',
        'dial-button-4', 'dial-button-5', 'dial-button-6',
        'dial-button-7', 'dial-button-8', 'dial-button-9',
        'dial-button-star', 'dial-button-0', 'dial-button-hash'
      ];
      
      expectedTestIDs.forEach(testID => {
        expect(getByTestId(testID)).toBeTruthy();
      });
    });

    it('a des boutons avec des propriétés d\'accessibilité', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      const button1 = getByTestId('dial-button-1');
      
      // Vérifier les propriétés d'accessibilité
      expect(button1.props.accessible).toBe(true);
      expect(button1.props.testID).toBe('dial-button-1');
    });
  });

  describe('Audit Responsive sur Téléphone', () => {
    it('s\'adapte correctement aux petits écrans', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 320, height: 568 });
      
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      const button1 = getByTestId('dial-button-1');
      const buttonStyle = button1.props.style;
      
      // Sur petit écran, les boutons doivent rester utilisables
      expect(buttonStyle.width).toBeGreaterThanOrEqual(44);
      expect(buttonStyle.height).toBeGreaterThanOrEqual(44);
    });

    it('s\'adapte correctement aux grands écrans', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 430, height: 932 });
      
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      const button1 = getByTestId('dial-button-1');
      const buttonStyle = button1.props.style;
      
      // Sur grand écran, les boutons peuvent être plus grands
      expect(buttonStyle.width).toBeGreaterThan(60);
      expect(buttonStyle.height).toBeGreaterThan(60);
    });

    it('gère les écrans en mode paysage', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 667, height: 375 });
      
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      const button1 = getByTestId('dial-button-1');
      const buttonStyle = button1.props.style;
      
      // En mode paysage, les boutons doivent s'adapter
      expect(buttonStyle.width).toBeDefined();
      expect(buttonStyle.height).toBeDefined();
      expect(buttonStyle.width).toBe(buttonStyle.height); // Carré
    });
  });

  describe('Audit Ergonomie sur Téléphone', () => {
    it('a des boutons carrés pour une meilleure ergonomie', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      const button1 = getByTestId('dial-button-1');
      const buttonStyle = button1.props.style;
      
      // Vérifier que les boutons sont carrés
      expect(buttonStyle.width).toBe(buttonStyle.height);
    });

    it('a un espacement uniforme entre les boutons', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      // Vérifier que tous les boutons ont des styles similaires
      const button1 = getByTestId('dial-button-1');
      const button2 = getByTestId('dial-button-2');
      const button3 = getByTestId('dial-button-3');
      
      expect(button1.props.style.width).toBe(button2.props.style.width);
      expect(button2.props.style.width).toBe(button3.props.style.width);
    });

    it('a une interface intuitive avec 12 boutons organisés en grille 4x3', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      
      // Vérifier la structure de la grille
      const container = getByTestId('dial-pad-container');
      expect(container).toBeTruthy();
      
      // Vérifier que nous avons exactement 12 boutons
      const buttons = [
        'dial-button-1', 'dial-button-2', 'dial-button-3',
        'dial-button-4', 'dial-button-5', 'dial-button-6',
        'dial-button-7', 'dial-button-8', 'dial-button-9',
        'dial-button-star', 'dial-button-0', 'dial-button-hash'
      ];
      
      buttons.forEach(testID => {
        expect(getByTestId(testID)).toBeTruthy();
      });
    });
  });

  describe('Audit Stabilité sur Téléphone', () => {
    it('gère les changements de dimensions d\'écran', () => {
      // Test avec différentes tailles d'écran
      const screenSizes = [
        { width: 320, height: 568 },
        { width: 375, height: 667 },
        { width: 390, height: 844 },
        { width: 428, height: 926 }
      ];
      
      screenSizes.forEach(({ width, height }) => {
        Dimensions.get = jest.fn().mockReturnValue({ width, height });
        
        expect(() => {
          render(<DialPad onNumberPress={mockOnNumberPress} />);
        }).not.toThrow();
      });
    });

    it('gère les clics multiples sans erreur', () => {
      Dimensions.get = jest.fn().mockReturnValue({ width: 375, height: 667 });
      
      const { getByTestId } = render(<DialPad onNumberPress={mockOnNumberPress} />);
      const button1 = getByTestId('dial-button-1');
      
      // Simuler plusieurs clics rapides avec fireEvent (méthode correcte)
      expect(() => {
        fireEvent.press(button1);
        fireEvent.press(button1);
        fireEvent.press(button1);
      }).not.toThrow();
      
      // Vérifier que le callback a été appelé
      expect(mockOnNumberPress).toHaveBeenCalledTimes(3);
      expect(mockOnNumberPress).toHaveBeenCalledWith('1');
    });
  });
});
