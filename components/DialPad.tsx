import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Vibration, Platform } from 'react-native';

const { height } = Dimensions.get('window');

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

  // Calcul de la taille de police adaptative
  const getAdaptiveFontSize = () => {
    const buttonSize = height * 0.12 - 20; // Taille du bouton moins les marges
    return Math.max(24, Math.min(buttonSize * 0.6, 48)); // Entre 24px et 48px
  };

  return (
    <View testID='dial-pad-container' style={styles.container}>
      {dialPadNumbers.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map(num => (
            <TouchableOpacity
              key={num}
              testID={`dial-button-${num === '*' ? 'star' : num === '#' ? 'hash' : num}`}
              style={styles.button}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: height * 0.12,
  },
  button: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    borderWidth: 2,
    // Effet 3D avec petite élévation + ombres et bordures contrastées
    elevation: 2, // Élévation très subtile pour Android
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    // Effet 3D subtil avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 0.8)', // Bordure supérieure plus claire
    borderLeftColor: 'rgba(255, 255, 255, 0.8)', // Bordure gauche plus claire
    borderRightColor: 'rgba(255, 255, 255, 0.4)', // Bordure droite plus sombre
    borderBottomColor: 'rgba(255, 255, 255, 0.4)', // Bordure inférieure plus sombre
  },
  buttonText: {
    color: 'white',
    fontSize: 0, // Taille automatique qui s'adapte au bouton
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
