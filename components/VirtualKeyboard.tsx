import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Vibration,
  SafeAreaView,
} from 'react-native';

const { height } = Dimensions.get('window');

import { VirtualKeyboardProps } from '../types';

/**
 * Nouveau clavier virtuel simple et moderne
 * Structure claire et intuitive pour les seniors
 */
export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onValidate,
  onClose,
  currentText,
}) => {
  const [isNumbersMode, setIsNumbersMode] = useState(false);

  // Configuration des touches
  const letters = [
    ['A', 'B', 'C', 'D', 'E', 'F'],
    ['G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'Q', 'R'],
    ['S', 'T', 'U', 'V', 'W', 'X'],
    ['Y', 'Z']
  ];

  const numbers = [
    ['1', '2', '3', '4', '5', '6'],
    ['7', '8', '9', '0', '-', '_'],
    ['@', '.', ',', '!', '?', '&'],
    ['(', ')', '[', ']', '{', '}'],
    ['#', '$', '%', '+', '=', '/']
  ];

  // Gestion des interactions
  const handleKeyPress = (key: string) => {
    Vibration.vibrate(50);
    onKeyPress(key);
  };

  const handleBackspace = () => {
    Vibration.vibrate(100);
    onBackspace();
  };

  const handleValidate = () => {
    Vibration.vibrate(200);
    onValidate();
  };

  const handleClose = () => {
    Vibration.vibrate(100);
    onClose();
  };

  const toggleMode = () => {
    Vibration.vibrate(50);
    setIsNumbersMode(!isNumbersMode);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Clavier Virtuel</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.textDisplay}>
          <Text style={styles.textLabel}>Texte saisi :</Text>
          <Text style={styles.textValue}>
            {currentText || 'Aucun texte'}
          </Text>
        </View>

        <TouchableOpacity style={styles.modeToggle} onPress={toggleMode}>
          <Text style={styles.modeToggleText}>
            {isNumbersMode ? 'ABC' : '123'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Clavier principal */}
      <View style={styles.keyboard}>
        {(isNumbersMode ? numbers : letters).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyRow}>
            {row.map(key => (
              <TouchableOpacity
                key={key}
                style={styles.keyButton}
                onPress={() => handleKeyPress(key)}
                activeOpacity={0.7}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Touches spéciales */}
        <View style={styles.specialRow}>
          <TouchableOpacity
            style={[styles.specialButton, styles.spaceButton]}
            onPress={() => handleKeyPress(' ')}
            activeOpacity={0.7}
          >
            <Text style={styles.specialButtonText}>Espace</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.specialButton, styles.backspaceButton]}
            onPress={handleBackspace}
            activeOpacity={0.7}
          >
            <Text style={styles.specialButtonText}>⌫</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bouton de validation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.validateButton} onPress={handleValidate}>
          <Text style={styles.validateButtonText}>✅ Valider</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // En-tête
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  closeButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  textDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },

  textLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },

  textValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minHeight: 50,
    minWidth: 200,
  },

  modeToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignSelf: 'center',
  },

  modeToggleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Clavier principal
  keyboard: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  keyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },

  keyButton: {
    width: 55,
    height: 55,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  keyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },

  specialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  specialButton: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    borderRadius: 15,
    borderWidth: 2,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  spaceButton: {
    width: 220,
    backgroundColor: '#FFC107',
    borderColor: '#FFA000',
  },

  backspaceButton: {
    width: 90,
    backgroundColor: '#F44336',
    borderColor: '#D32F2F',
  },

  specialButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Pied de page
  footer: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
  },

  validateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#388E3C',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  validateButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
