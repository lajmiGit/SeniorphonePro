import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

interface DialPadProps {
  onNumberPress: (num: string) => void;
}

export const DialPad: React.FC<DialPadProps> = ({ onNumberPress }) => {
  const dialPadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  // Calcul de la taille de police adaptative
  const getAdaptiveFontSize = () => {
    const buttonSize = (height * 0.12) - 20; // Taille du bouton moins les marges
    return Math.max(24, Math.min(buttonSize * 0.6, 48)); // Entre 24px et 48px
  };

  return (
    <View style={styles.container}>
      {dialPadNumbers.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.button}
              onPress={() => onNumberPress(num)}
              activeOpacity={0.5}
              pressRetentionOffset={{ top: 20, left: 20, right: 20, bottom: 20 }}
            >
              <Text style={[styles.buttonText, { fontSize: getAdaptiveFontSize() }]}>
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
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    aspectRatio: 1,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    // Effet 3D avec bordure interne
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
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
