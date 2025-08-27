import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface PhoneDisplayProps {
  phoneNumber: string;
  onClear: () => void;
}

export const PhoneDisplay: React.FC<PhoneDisplayProps> = ({ phoneNumber, onClear }) => {
  const formatPhoneNumber = (number: string) => {
    if (number.length === 0) return '';
    
    // Formatage pour la lisibilité (ajout d'espaces tous les 2 chiffres)
    const formatted = number.replace(/(\d{2})(?=\d)/g, '$1 ');
    return formatted;
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.phoneInput}
          value={formatPhoneNumber(phoneNumber)}
          placeholder="Numéro de téléphone"
          placeholderTextColor="#999"
          editable={false}
          multiline={false}
        />
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={onClear}
          activeOpacity={0.6}
        >
          <Text style={styles.clearButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      
      {phoneNumber.length > 0 && (
        <View style={styles.numberInfo}>
          <Text style={styles.numberLength}>
            {phoneNumber.length} chiffre{phoneNumber.length > 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '80%',
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginRight: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  clearButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  numberInfo: {
    alignItems: 'center',
    marginTop: 5,
  },
  numberLength: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
});
