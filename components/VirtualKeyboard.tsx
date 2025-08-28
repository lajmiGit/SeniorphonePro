import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Vibration,
  SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

import { VirtualKeyboardProps } from '../types';

/**
 * Clavier virtuel simplifié et optimisé pour les seniors
 * 
 * NOUVELLE STRUCTURE SIMPLIFIÉE :
 * ┌─────────────────────────────────────┐
 * │ PARTIE 1: EN-TÊTE (20% hauteur)    │
 * │ - Titre + Bouton fermer            │
 * │ - Texte saisi en cours             │
 * │ - Boutons ABC/123                  │
 * ├─────────────────────────────────────┤
 * │ PARTIE 2: CLAVIER (65% hauteur)    │
 * │ - Grille de touches 6x5            │
 * │ - Touches Espace et Retour         │
 * ├─────────────────────────────────────┤
 * │ PARTIE 3: VALIDATION (15% hauteur) │
 * │ - Bouton Valider large             │
 * └─────────────────────────────────────┘
 */
export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onValidate,
  onClose,
  currentText,
}) => {
  const [showNumbers, setShowNumbers] = useState(false);

  // Configuration des touches
  const letterKeys = [
    ['A', 'B', 'C', 'D', 'E', 'F'],
    ['G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'Q', 'R'],
    ['S', 'T', 'U', 'V', 'W', 'X'],
    ['Y', 'Z']
  ];

  const numberKeys = [
    ['1', '2', '3', '4', '5', '6'],
    ['7', '8', '9', '0', '-', '_'],
    ['@', '.', ',', '!', '?', '&'],
    ['(', ')', '[', ']', '{', '}'],
    ['#', '$', '%', '+', '=', '/']
  ];

  // Dimensions calculées
  const headerHeight = height * 0.20;      // 20% - En-tête
  const keyboardHeight = height * 0.65;    // 65% - Clavier
  const validationHeight = height * 0.15;  // 15% - Validation
  
  const keySize = Math.min(
    (width - 60) / 6,        // 6 touches par ligne avec marges
    keyboardHeight / 7        // 7 rangées maximum
  );

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
    setShowNumbers(!showNumbers);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* PARTIE 1: EN-TÊTE (20% hauteur) */}
      <View style={[styles.header, { height: headerHeight }]}>
        {/* Barre de titre avec bouton fermer */}
        <View style={styles.titleBar}>
          <Text style={styles.title}>Clavier Virtuel</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Affichage du texte saisi */}
        <View style={styles.textDisplay}>
          <Text style={styles.textLabel}>Texte saisi :</Text>
          <Text style={styles.textValue}>
            {currentText || 'Aucun texte'}
          </Text>
        </View>

        {/* Bouton de basculement ABC/123 */}
        <TouchableOpacity
          style={[styles.modeButton, showNumbers && styles.modeButtonActive]}
          onPress={toggleMode}
          activeOpacity={0.7}
        >
          <Text style={[styles.modeButtonText, showNumbers && styles.modeButtonTextActive]}>
            {showNumbers ? 'ABC' : '123'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* PARTIE 2: CLAVIER (65% hauteur) */}
      <View style={[styles.keyboard, { height: keyboardHeight }]}>
        {/* Grille de touches */}
        {(showNumbers ? numberKeys : letterKeys).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyRow}>
            {row.map(key => (
              <TouchableOpacity
                key={key}
                style={styles.keyButton}
                onPress={() => handleKeyPress(key)}
                activeOpacity={0.6}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Ligne des touches spéciales */}
        <View style={styles.specialRow}>
          <TouchableOpacity
            style={[styles.specialButton, styles.spaceButton]}
            onPress={() => handleKeyPress(' ')}
            activeOpacity={0.6}
          >
            <Text style={styles.specialButtonText}>Espace</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.specialButton, styles.backspaceButton]}
            onPress={handleBackspace}
            activeOpacity={0.6}
          >
            <Text style={styles.specialButtonText}>⌫</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PARTIE 3: VALIDATION (15% hauteur) */}
      <View style={[styles.validation, { height: validationHeight }]}>
        <TouchableOpacity
          style={styles.validateButton}
          onPress={handleValidate}
          activeOpacity={0.7}
        >
          <Text style={styles.validateButtonText}>✅ Valider</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // PARTIE 1: EN-TÊTE
  header: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 3,
    borderBottomColor: '#388E3C',
  },
  
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
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
    marginBottom: 15,
  },
  
  textLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 5,
  },
  
  textValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    minHeight: 30,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  modeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignSelf: 'center',
  },
  
  modeButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  
  modeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  
  // PARTIE 2: CLAVIER
  keyboard: {
    padding: 20,
    justifyContent: 'center',
  },
  
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  
  keyButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  keyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  
  specialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  
  specialButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 12,
    borderWidth: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  spaceButton: {
    width: 200,
    backgroundColor: '#FFC107',
    borderColor: '#FFA000',
  },
  
  backspaceButton: {
    width: 80,
    backgroundColor: '#F44336',
    borderColor: '#D32F2F',
  },
  
  specialButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  // PARTIE 3: VALIDATION
  validation: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
  },
  
  validateButton: {
    width: '80%',
    height: 60,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#388E3C',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  
  validateButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
