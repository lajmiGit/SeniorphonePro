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

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onValidate: () => void;
  onClose: () => void;
  currentText: string;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onValidate,
  onClose,
  currentText,
}) => {
  const [showNumbers, setShowNumbers] = useState(false);

  // Définition des caractères du clavier - Lettres
  const letterRows = [
    ['A', 'B', 'C', 'D', 'E', 'F'],
    ['G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'Q', 'R'],
    ['S', 'T', 'U', 'V', 'W', 'X'],
    ['Y', 'Z'],
  ];

  // Définition des caractères du clavier - Chiffres et caractères spéciaux
  const numberRows = [
    ['1', '2', '3', '4', '5', '6'],
    ['7', '8', '9', '0', '-', '_'],
    ['@', '.', ',', '!', '?', '&'],
    ['(', ')', '[', ']', '{', '}'],
    ['#', '$', '%', '+', '=', '/'],
  ];

  const keyboardRows = showNumbers ? numberRows : letterRows;

  // Calculs dynamiques pour la responsivité
  const headerHeight = height * 0.15;
  const keySize = Math.min((width - 40) / 6, (height * 0.6) / 6);
  const keySpacing = keySize * 0.1;
  const keyboardPadding = width * 0.05;

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

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête responsive */}
      <View style={[styles.header, { height: headerHeight }]}>
        {/* Bouton fermer en haut à droite */}
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={[
              styles.closeButton,
              { width: keySize * 0.8, height: keySize * 0.8 },
            ]}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeButtonText, { fontSize: keySize * 0.3 }]}>
              ❌
            </Text>
          </TouchableOpacity>
        </View>

        {/* Affichage du texte saisi */}
        <View style={styles.textDisplay}>
          <Text
            style={[
              styles.currentTextLabel,
              { fontSize: Math.max(16, width * 0.04) },
            ]}
          >
            Texte saisi :
          </Text>
          <Text
            style={[
              styles.currentText,
              { fontSize: Math.max(20, width * 0.05) },
            ]}
          >
            {currentText || 'Aucun texte'}
          </Text>
        </View>

        {/* Boutons de basculement ABC/123 */}
        <View
          style={[
            styles.toggleContainer,
            {
              padding: keySize * 0.15,
              borderRadius: keySize * 0.2,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !showNumbers && styles.toggleButtonActive,
              {
                paddingVertical: keySize * 0.12,
                paddingHorizontal: keySize * 0.2,
                borderRadius: keySize * 0.15,
                marginHorizontal: keySize * 0.05,
              },
            ]}
            onPress={() => setShowNumbers(false)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.toggleButtonText,
                !showNumbers && styles.toggleButtonTextActive,
                { fontSize: Math.max(18, keySize * 0.25) },
              ]}
            >
              ABC
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              showNumbers && styles.toggleButtonActive,
              {
                paddingVertical: keySize * 0.12,
                paddingHorizontal: keySize * 0.2,
                borderRadius: keySize * 0.15,
                marginHorizontal: keySize * 0.05,
              },
            ]}
            onPress={() => setShowNumbers(true)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.toggleButtonText,
                showNumbers && styles.toggleButtonTextActive,
                { fontSize: Math.max(18, keySize * 0.25) },
              ]}
            >
              123
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Clavier principal responsive */}
      <View style={[styles.keyboardContainer, { padding: keyboardPadding }]}>
        {keyboardRows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[styles.keyboardRow, { marginBottom: keySpacing }]}
          >
            {row.map(key => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.keyButton,
                  {
                    width: keySize,
                    height: keySize,
                    marginHorizontal: keySpacing / 2,
                    borderRadius: keySize * 0.2,
                    borderWidth: Math.max(3, keySize * 0.05),
                    elevation: Math.max(8, keySize * 0.12),
                    shadowRadius: Math.max(8, keySize * 0.12),
                  },
                ]}
                onPress={() => handleKeyPress(key)}
                activeOpacity={0.6}
              >
                <Text
                  style={[
                    styles.keyText,
                    { fontSize: Math.max(24, keySize * 0.4) },
                  ]}
                >
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Ligne des touches spéciales responsive */}
        <View style={[styles.specialRow, { marginTop: keySpacing * 1.5 }]}>
          <TouchableOpacity
            style={[
              styles.specialButton,
              styles.spaceButton,
              {
                height: keySize,
                width: keySize * 4,
                borderRadius: keySize * 0.2,
                marginRight: keySpacing * 2,
                borderWidth: Math.max(3, keySize * 0.05),
                elevation: Math.max(8, keySize * 0.12),
                shadowRadius: Math.max(8, keySize * 0.12),
              },
            ]}
            onPress={() => handleKeyPress(' ')}
            activeOpacity={0.6}
          >
            <Text
              style={[
                styles.specialButtonText,
                { fontSize: Math.max(18, keySize * 0.25) },
              ]}
            >
              Espace
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.specialButton,
              styles.backspaceButton,
              {
                height: keySize,
                width: keySize * 1.5,
                borderRadius: keySize * 0.2,
                borderWidth: Math.max(3, keySize * 0.05),
                elevation: Math.max(8, keySize * 0.12),
                shadowRadius: Math.max(8, keySize * 0.12),
              },
            ]}
            onPress={handleBackspace}
            activeOpacity={0.6}
          >
            <Text
              style={[
                styles.specialButtonText,
                { fontSize: Math.max(20, keySize * 0.3) },
              ]}
            >
              ⌫
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bouton de validation responsive - EN BAS */}
      <View style={[styles.validationContainer, { padding: keyboardPadding }]}>
        <TouchableOpacity
          style={[
            styles.validateButton,
            {
              height: keySize * 1.2,
              borderRadius: keySize * 0.2,
              borderWidth: Math.max(4, keySize * 0.06),
              elevation: Math.max(12, keySize * 0.18),
              shadowRadius: Math.max(10, keySize * 0.15),
            },
          ]}
          onPress={handleValidate}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.validateButtonText,
              { fontSize: Math.max(24, keySize * 0.35) },
            ]}
          >
            ✅ Valider
          </Text>
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
  header: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  headerTop: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  textDisplay: {
    alignItems: 'center',
    marginBottom: 10,
  },
  currentTextLabel: {
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  currentText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  toggleButton: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  toggleButtonText: {
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  keyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  keyText: {
    fontWeight: 'bold',
    color: '#333333',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  specialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  specialButton: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  spaceButton: {
    backgroundColor: '#FFC107',
  },
  backspaceButton: {
    backgroundColor: '#F44336',
  },
  specialButtonText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  validationContainer: {
    alignItems: 'center',
  },
  validateButton: {
    width: '80%',
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  validateButtonText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
});
