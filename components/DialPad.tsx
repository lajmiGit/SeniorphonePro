import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Vibration, Platform } from 'react-native';

const { height, width } = Dimensions.get('window');

/**
 * Interface des propriétés du composant DialPad
 * @interface DialPadProps
 * @property {(num: string) => void} onNumberPress - Callback appelé quand un bouton est pressé
 */
interface DialPadProps {
  onNumberPress: (num: string) => void;
}

/**
 * Composant DialPad - Pavé numérique tactile avec retour haptique
 * optimisé pour les seniors avec des boutons 3D et une interface intuitive.
 *
 * @component
 * @param {DialPadProps} props - Propriétés du composant
 * @returns {JSX.Element} Composant DialPad rendu
 *
 * @example
 * ```tsx
 * <DialPad onNumberPress={(num) => console.log('Numéro pressé:', num)} />
 * ```
 *
 * @features
 * - Boutons numériques 0-9 avec symboles * et #
 * - Retour haptique (vibration) lors de la pression
 * - Effets visuels 3D avec ombres et bordures
 * - Taille de police adaptative selon l'écran
 * - Interface responsive et accessible
 * - Optimisé pour l'usage tactile
 * - Grille homogène 4x3 avec espacement minimal
 */
export const DialPad: React.FC<DialPadProps> = ({ onNumberPress }) => {
  // Retour haptique simple et fiable
  const playHapticFeedback = () => {
    try {
      if (Platform.OS === 'ios') {
        // Vibration courte pour iOS
        Vibration.vibrate(50);
      } else if (Platform.OS === 'android') {
        // Vibration courte pour Android
        Vibration.vibrate(50);
      }
      console.log('📳 Retour haptique activé');
    } catch (error) {
      console.log('❌ Erreur lors de la vibration:', error);
    }
  };

  // Gestion de la pression sur une touche avec retour haptique
  const handleNumberPress = (num: string) => {
    // Activer le retour haptique
    playHapticFeedback();

    // Appeler la fonction de callback
    onNumberPress(num);
  };

  const dialPadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  // Calcul de la taille optimale des boutons pour une grille homogène
  const calculateGridDimensions = () => {
    const containerWidth = width - 40; // Largeur disponible (moins padding)
    const containerHeight = height * 0.6; // Hauteur disponible pour le pavé
    
    // Espacement minimal fixe
    const spacing = 7; // Espacement fixe de 7px (compromis optimal)
    
    // Calculer la taille des boutons en tenant compte de tous les espacements
    const buttonSize = Math.min(
      (containerWidth - spacing * 4) / 3, // 3 boutons + 4 espacements (2 entre boutons + 2 marges)
      (containerHeight - spacing * 5) / 4 // 4 boutons + 5 espacements (3 entre lignes + 2 marges)
    );
    
    return {
      buttonSize,
      spacing,
      containerWidth: buttonSize * 3 + spacing * 4, // 3 boutons + 4 espacements
      containerHeight: buttonSize * 4 + spacing * 5, // 4 boutons + 5 espacements
    };
  };

  const { buttonSize, spacing } = calculateGridDimensions();

  // Calcul de la taille de police adaptative
  const getAdaptiveFontSize = () => {
    return Math.max(16, Math.min(buttonSize * 0.4, 32)); // 40% de la taille du bouton
  };

  return (
    <View testID='dial-pad-container' style={styles.container}>
      <View style={[styles.gridContainer, { width: buttonSize * 3 + spacing * 4 }]}>
        {dialPadNumbers.map((row, rowIndex) => (
          <View 
            key={rowIndex} 
            style={[
              styles.row,
              {
                marginBottom: rowIndex < 3 ? spacing : 0,
              }
            ]}
          >
            {row.map((num, colIndex) => (
              <TouchableOpacity
                key={num}
                testID={`dial-button-${num === '*' ? 'star' : num === '#' ? 'hash' : num}`}
                style={[
                  styles.button,
                  {
                    width: buttonSize,
                    height: buttonSize,
                    marginRight: colIndex < 2 ? spacing : 0,
                  }
                ]}
                onPress={() => handleNumberPress(num)}
                activeOpacity={0.5}
                pressRetentionOffset={{
                  top: 20,
                  left: 20,
                  right: 20,
                  bottom: 20,
                }}
              >
                <Text
                  style={[styles.buttonText, { fontSize: getAdaptiveFontSize() }]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  gridContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    // Effet 3D avec petite élévation + ombres et bordures noires
    elevation: 2, // Élévation très subtile pour Android
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderColor: '#000000', // Bordure noire principale
    // Effet 3D avec bordures noires contrastées
    borderTopColor: '#000000', // Bordure supérieure noire
    borderLeftColor: '#000000', // Bordure gauche noire
    borderRightColor: '#000000', // Bordure droite noire
    borderBottomColor: '#000000', // Bordure inférieure noire
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
