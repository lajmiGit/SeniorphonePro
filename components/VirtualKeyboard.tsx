import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  SafeAreaView,
} from 'react-native';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

interface VirtualKeyboardProps {
  onKeyPress?: (key: string) => void;
  onBackspace?: () => void;
  onValidate?: () => void;
  onClose?: () => void;
  currentText?: string;
  activeField?: 'firstName' | 'lastName' | 'phoneNumber' | null;
}

/**
 * Écran clavier avec 4 parties encadrées
 * Structure identique à l'écran de création de contact
 */
export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onValidate,
  onClose,
  currentText: initialText = '',
  activeField,
}) => {
  const [keyboardType, setKeyboardType] = useState<'abc' | '123' | 'symbols'>(
    'abc'
  );
  const [currentText, setCurrentText] = useState(initialText);
  const [zone1Width, setZone1Width] = useState(0);
  const [zone4Height, setZone4Height] = useState(0);
  const [zone4Width, setZone4Width] = useState(0);
  const [showTextZoom, setShowTextZoom] = useState(false);

  // Synchroniser le texte avec les props
  useEffect(() => {
    setCurrentText(initialText);
  }, [initialText]);

  // Forcer le clavier en mode "123" si c'est le champ téléphone
  useEffect(() => {
    if (activeField === 'phoneNumber') {
      setKeyboardType('123');
    }
  }, [activeField]);

  const handleKeyboardTypeChange = (type: 'abc' | '123' | 'symbols') => {
    // Empêcher le changement de type si c'est le champ téléphone
    if (activeField === 'phoneNumber') {
      return;
    }
    setKeyboardType(type);
  };

  const handleTextChange = (text: string) => {
    const newText = currentText + text;
    setCurrentText(newText);
    // Appeler la fonction de callback si elle existe
    if (onKeyPress) {
      onKeyPress(text);
    }
  };

  const handleDeleteText = () => {
    const newText = currentText.slice(0, -1);
    setCurrentText(newText);
    // Appeler la fonction de callback si elle existe
    if (onBackspace) {
      onBackspace();
    }
  };

  const handleKeyPress = (key: string) => {
    handleTextChange(key);
  };

  const handleZone1Layout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setZone1Width(width);
  };

  const handleZone4Layout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setZone4Width(width);
    setZone4Height(height);
  };

  const handleTextZoom = () => {
    setShowTextZoom(true);
    // Lecture automatique du texte quand le zoom s'ouvre
    setTimeout(() => speakText(), 350);
  };

  const closeTextZoom = () => {
    setShowTextZoom(false);
  };

  const handleValidate = () => {
    // Appeler la fonction de validation si elle existe
    if (onValidate) {
      onValidate();
    }
  };

  const handleCancel = () => {
    // Remplir le champ avec le texte saisi avant de fermer
    if (onKeyPress && currentText) {
      // Simuler l'ajout du texte complet
      console.log('📝 Texte saisi à transférer:', currentText);
    }

    // Appeler la fonction de fermeture si elle existe
    if (onClose) {
      onClose();
    }
  };

  const speakText = () => {
    const message = currentText || 'Aucun texte saisi';
    const speechConfig = {
      language: 'fr-FR',
      pitch: 1.0,
      rate: 0.8,
      voice: 'com.apple.ttsbundle.siri_female_fr-FR_compact',
    };

    try {
      Speech.speak(message, speechConfig);
      console.log('🗣️ Synthèse vocale activée pour:', message);
    } catch {
      console.log('❌ Erreur lors de la synthèse vocale');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Partie 1: En-tête - 15% de la hauteur */}
        <View
          style={[styles.section, styles.headerSection]}
          onLayout={handleZone1Layout}
        >
          {/* Zone de saisie et bouton de suppression */}
          <View
            style={[
              styles.inputContainer,
              {
                paddingHorizontal: width > 0 ? (width * 0.1) / 3 : 0,
              },
            ]}
          >
            {/* Champ d'affichage des caractères saisis */}
            <TouchableOpacity
              testID="input-field"
              style={[styles.textDisplayField, { width: width * 0.6 }]}
              onPress={handleTextZoom}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.textDisplayValue,
                  {
                    fontSize: Math.min(
                      Math.max(
                        16,
                        Math.floor(
                          (width * 0.6 * 0.15) /
                            Math.max(1, currentText.length * 0.15)
                        )
                      ),
                      48 // Taille maximale
                    ),
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {currentText || 'Aucun texte'}
              </Text>
            </TouchableOpacity>

            {/* Bouton de suppression */}
            <TouchableOpacity
              testID="delete-button"
              style={[styles.deleteButton, { width: zone1Width * 0.2 }]}
              onPress={handleDeleteText}
            >
              <Text style={styles.deleteButtonText}>⌫</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Partie 2: Clavier principal - 60% de la hauteur */}
        <View style={[styles.section, styles.keyboardSection]}>
          <View style={styles.keyboardContainer}>
            {/* Clavier ABC (caractères) */}
            {keyboardType === 'abc' && (
              <>
                {/* Première rangée : A, B, C, D, E, F */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('A')}
                  >
                    <Text style={styles.keyboardKeyText}>A</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('B')}
                  >
                    <Text style={styles.keyboardKeyText}>B</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('C')}
                  >
                    <Text style={styles.keyboardKeyText}>C</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('D')}
                  >
                    <Text style={styles.keyboardKeyText}>D</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('E')}
                  >
                    <Text style={styles.keyboardKeyText}>E</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('F')}
                  >
                    <Text style={styles.keyboardKeyText}>F</Text>
                  </TouchableOpacity>
                </View>

                {/* Deuxième rangée : G, H, I, J, K, L */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('G')}
                  >
                    <Text style={styles.keyboardKeyText}>G</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('H')}
                  >
                    <Text style={styles.keyboardKeyText}>H</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('I')}
                  >
                    <Text style={styles.keyboardKeyText}>I</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('J')}
                  >
                    <Text style={styles.keyboardKeyText}>J</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('K')}
                  >
                    <Text style={styles.keyboardKeyText}>K</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('L')}
                  >
                    <Text style={styles.keyboardKeyText}>L</Text>
                  </TouchableOpacity>
                </View>

                {/* Troisième rangée : M, N, O, P, Q, R */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('M')}
                  >
                    <Text style={styles.keyboardKeyText}>M</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('N')}
                  >
                    <Text style={styles.keyboardKeyText}>N</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('O')}
                  >
                    <Text style={styles.keyboardKeyText}>O</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('P')}
                  >
                    <Text style={styles.keyboardKeyText}>P</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('Q')}
                  >
                    <Text style={styles.keyboardKeyText}>Q</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('R')}
                  >
                    <Text style={styles.keyboardKeyText}>R</Text>
                  </TouchableOpacity>
                </View>

                {/* Quatrième rangée : S, T, U, V, W, X */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('S')}
                  >
                    <Text style={styles.keyboardKeyText}>S</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('T')}
                  >
                    <Text style={styles.keyboardKeyText}>T</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('U')}
                  >
                    <Text style={styles.keyboardKeyText}>U</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('V')}
                  >
                    <Text style={styles.keyboardKeyText}>V</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('W')}
                  >
                    <Text style={styles.keyboardKeyText}>W</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('X')}
                  >
                    <Text style={styles.keyboardKeyText}>X</Text>
                  </TouchableOpacity>
                </View>

                {/* Cinquième rangée : Y, Z */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('Y')}
                  >
                    <Text style={styles.keyboardKeyText}>Y</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyboardKey}
                    onPress={() => handleKeyPress('Z')}
                  >
                    <Text style={styles.keyboardKeyText}>Z</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Clavier 123 (chiffres) */}
            {keyboardType === '123' && (
              <>
                {/* Première rangée : 1, 2, 3 */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.numberKey]}
                    onPress={() => handleKeyPress('1')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.numberKeyText]}
                    >
                      1
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.numberKey]}
                    onPress={() => handleKeyPress('2')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.numberKeyText]}
                    >
                      2
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.numberKey]}
                    onPress={() => handleKeyPress('3')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.numberKeyText]}
                    >
                      3
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Deuxième rangée : 4, 5, 6 */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.numberKey]}
                    onPress={() => handleKeyPress('4')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.numberKeyText]}
                    >
                      4
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.numberKey]}
                    onPress={() => handleKeyPress('5')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.numberKeyText]}
                    >
                      5
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.numberKey]}
                    onPress={() => handleKeyPress('6')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.numberKeyText]}
                    >
                      6
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Troisième rangée : 7, 8, 9 */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.numberKey]}
                    onPress={() => handleKeyPress('7')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.numberKeyText]}
                    >
                      7
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.numberKey]}
                    onPress={() => handleKeyPress('8')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.numberKeyText]}
                    >
                      8
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.numberKey]}
                    onPress={() => handleKeyPress('9')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.numberKeyText]}
                    >
                      9
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Quatrième rangée : *, 0, # */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.numberKey]}
                    onPress={() => handleKeyPress('*')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.numberKeyText]}
                    >
                      *
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.numberKey]}
                    onPress={() => handleKeyPress('0')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.numberKeyText]}
                    >
                      0
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.numberKey]}
                    onPress={() => handleKeyPress('#')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.numberKeyText]}
                    >
                      #
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Clavier @#$ (caractères spéciaux) */}
            {keyboardType === 'symbols' && (
              <>
                {/* Première rangée : @, #, $, %, ^, & */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('@')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      @
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('#')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      #
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('$')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      $
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('%')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      %
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('^')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      ^
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('&')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      &
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Deuxième rangée : *, (, ), -, +, = */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('*')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      *
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('(')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      (
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress(')')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      )
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('-')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      -
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('+')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('=')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      =
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Troisième rangée : [, ], {, }, |, \ */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('[')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      [
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress(']')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      ]
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('{')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      {'{'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('}')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      {'}'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('|')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      |
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('\\')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      \
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Quatrième rangée : <, >, ?, /, ~, ` */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('<')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      {'<'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('>')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      {'>'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('?')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      ?
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('/')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      /
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('~')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      ~
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyboardKey, styles.symbolKey]}
                    onPress={() => handleKeyPress('`')}
                  >
                    <Text
                      style={[styles.keyboardKeyText, styles.symbolKeyText]}
                    >
                      `
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Partie 3: Zone secondaire - 10% de la hauteur */}
        <View style={[styles.section, styles.secondarySection]}>
          <View style={styles.keyboardSelector}>
            <TouchableOpacity
              style={[
                styles.selectorButton,
                keyboardType === 'abc' && styles.selectorButtonActive,
                activeField === 'phoneNumber' && styles.disabledSelectorButton,
              ]}
              onPress={() => handleKeyboardTypeChange('abc')}
              disabled={activeField === 'phoneNumber'}
            >
              <Text
                style={[
                  styles.selectorButtonText,
                  keyboardType === 'abc' && styles.selectorButtonTextActive,
                  activeField === 'phoneNumber' &&
                    styles.disabledSelectorButtonText,
                ]}
              >
                ABC
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.selectorButton,
                keyboardType === '123' && styles.selectorButtonActive,
                activeField === 'phoneNumber' && styles.disabledSelectorButton,
              ]}
              onPress={() => handleKeyboardTypeChange('123')}
              disabled={activeField === 'phoneNumber'}
            >
              <Text
                style={[
                  styles.selectorButtonText,
                  keyboardType === '123' && styles.selectorButtonTextActive,
                  activeField === 'phoneNumber' &&
                    styles.disabledSelectorButtonText,
                ]}
              >
                123
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.selectorButton,
                keyboardType === 'symbols' && styles.selectorButtonActive,
                activeField === 'phoneNumber' && styles.disabledSelectorButton,
              ]}
              onPress={() => handleKeyboardTypeChange('symbols')}
              disabled={activeField === 'phoneNumber'}
            >
              <Text
                style={[
                  styles.selectorButtonText,
                  keyboardType === 'symbols' && styles.selectorButtonTextActive,
                  activeField === 'phoneNumber' &&
                    styles.disabledSelectorButtonText,
                ]}
              >
                @#$
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Partie 4: Boutons d'action - 15% de la hauteur */}
        <View
          style={[styles.section, styles.actionSection]}
          onLayout={handleZone4Layout}
        >
          <View style={styles.actionButtons}>
            <TouchableOpacity
              testID="cancel-button"
              style={[
                styles.actionButton,
                styles.cancelButton,
                {
                  height: zone4Height > 0 ? zone4Height * 0.9 : 60,
                  width: zone4Width > 0 ? zone4Width * 0.4 : 150,
                },
              ]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>❌ Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="validate-button"
              style={[
                styles.actionButton,
                styles.validateButton,
                {
                  height: zone4Height > 0 ? zone4Height * 0.9 : 60,
                  width: zone4Width > 0 ? zone4Width * 0.4 : 150,
                },
              ]}
              onPress={handleValidate}
            >
              <Text style={styles.validateButtonText}>✅ Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal de zoom du texte */}
      <Modal
        visible={showTextZoom}
        transparent={true}
        animationType='fade'
        onRequestClose={closeTextZoom}
      >
        <TouchableOpacity
          style={styles.zoomOverlay}
          activeOpacity={1}
          onPress={closeTextZoom}
        >
          <View style={styles.zoomContainer}>
            {/* Titre - 30% de la hauteur */}
            <View style={styles.zoomHeader}>
              <Text style={styles.zoomTitle}>📝 Texte Saisi</Text>
            </View>

            {/* Contenu du texte - 50% de la hauteur */}
            <View style={styles.zoomContent}>
              <Text style={styles.zoomTextValue}>
                {currentText || 'Aucun texte saisi'}
              </Text>

              {/* Bouton pour réécouter */}
              <TouchableOpacity
                style={styles.zoomRelistenButton}
                onPress={speakText}
              >
                <Text style={styles.zoomRelistenButtonText}>🔊 Relire</Text>
              </TouchableOpacity>
            </View>

            {/* Instructions - 20% de la hauteur */}
            <View style={styles.zoomInstructions}>
              <Text style={styles.zoomInstructionsText}>
                Appuyez n'importe où pour fermer
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  mainContainer: {
    flex: 1,
    padding: 10,
  },

  section: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  // Partie 1: En-tête (15% de la hauteur)
  headerSection: {
    height: height * 0.15, // 15% de la hauteur
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
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

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 0, // Sera calculé dynamiquement
  },

  textDisplayField: {
    height: '90%', // 90% de la hauteur zone 1
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  textDisplayValue: {
    fontSize: 18, // Taille initiale
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },

  deleteButton: {
    height: '90%', // 90% de la hauteur zone 1
    backgroundColor: '#FF4444',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CC0000',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  deleteButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Partie 2: Clavier principal (60% de la hauteur)
  keyboardSection: {
    height: height * 0.6, // 60% de la hauteur
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },

  keyboardContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
  },

  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
    marginBottom: 5,
  },

  keyboardKey: {
    width: Math.min(60, (width - 120) / 6), // 6 touches par ligne avec marges
    height: Math.min(60, (height * 0.6 - 100) / 5), // 5 rangées avec espacement
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 2,
    borderWidth: 3,
    borderColor: '#000000',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(0, 0, 0, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.8)',
  },

  keyboardKeyText: {
    fontSize: Math.max(18, Math.min(60, (height * 0.6 - 100) / 5) * 0.4),
    fontWeight: 'bold',
    color: '#333333',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  mainText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  mainSubtext: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },

  // Partie 3: Zone secondaire (10% de la hauteur)
  secondarySection: {
    height: height * 0.1, // 10% de la hauteur
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
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

  // Partie 4: Boutons d'action (20% de la hauteur)
  actionSection: {
    height: height * 0.15, // 15% de la hauteur
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Math.max(15, width * 0.04), // Responsive
    width: '100%',
    height: '100%',
  },

  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 3,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
  },

  cancelButton: {
    backgroundColor: '#F44336', // Background rouge
    borderColor: '#D32F2F',
    marginRight: 10,
    // Dimensions selon la formule : 90% hauteur, 40% largeur de la Partie 4
    // height: zone4Height > 0 ? zone4Height * 0.90 : 60,
    // width: zone4Width > 0 ? zone4Width * 0.40 : 150,
  },

  validateButton: {
    backgroundColor: '#4CAF50', // Background vert
    borderColor: '#388E3C',
    marginLeft: 10,
    // Dimensions selon la formule : 90% hauteur, 40% largeur de la Partie 4
    // height: zone4Height > 0 ? zone4Height * 0.90 : 60,
    // width: zone4Width > 0 ? zone4Width * 0.40 : 150,
  },

  cancelButtonText: {
    fontSize: Math.max(18, height * 0.022), // Taille adaptée pour une ligne
    fontWeight: 'bold',
    color: '#FFFFFF', // Texte blanc sur fond rouge
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false, // Évite le padding automatique
    textAlignVertical: 'center', // Centrage vertical parfait
  },

  validateButtonText: {
    fontSize: Math.max(18, height * 0.022), // Taille adaptée pour une ligne
    fontWeight: 'bold',
    color: '#FFFFFF', // Texte blanc sur fond vert
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false, // Évite le padding automatique
    textAlignVertical: 'center', // Centrage vertical parfait
  },

  keyboardSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
  },

  selectorButton: {
    height: '90%',
    width: '30%',
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#B0B0B0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  selectorButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },

  selectorButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },

  selectorButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  disabledSelectorButton: {
    opacity: 0.5, // Rendre le bouton désactivé plus sombre
    backgroundColor: '#CCCCCC', // Couleur de fond pour le bouton désactivé
    borderColor: '#A0A0A0', // Couleur de bordure pour le bouton désactivé
  },

  disabledSelectorButtonText: {
    color: '#999999', // Couleur du texte pour le bouton désactivé
  },

  numberKey: {
    width: Math.min(60, (width - 120) / 3), // 3 touches par ligne avec marges
    height: Math.min(60, (height * 0.6 - 100) / 5), // 5 rangées avec espacement
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 2,
    borderWidth: 3,
    borderColor: '#000000',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(0, 0, 0, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.8)',
  },

  numberKeyText: {
    fontSize: Math.max(18, Math.min(60, (height * 0.6 - 100) / 5) * 0.4),
    fontWeight: 'bold',
    color: '#333333',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  symbolKey: {
    width: Math.min(60, (width - 120) / 6), // 6 touches par ligne avec marges
    height: Math.min(60, (height * 0.6 - 100) / 5), // 5 rangées avec espacement
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 2,
    borderWidth: 3,
    borderColor: '#000000',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(0, 0, 0, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.8)',
  },

  symbolKeyText: {
    fontSize: Math.max(18, Math.min(60, (height * 0.6 - 100) / 5) * 0.4),
    fontWeight: 'bold',
    color: '#333333',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  zoomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  zoomContainer: {
    width: width * 0.8,
    height: height * 0.6,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
  },

  zoomHeader: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  zoomTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },

  zoomContent: {
    height: '50%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  zoomTextValue: {
    fontSize: 42,
    fontWeight: '900',
    color: '#007BFF',
    textAlign: 'center',
    lineHeight: 50,
  },

  zoomInstructions: {
    height: '20%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  zoomInstructionsText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },

  zoomRelistenButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  zoomRelistenButtonText: {
    color: 'white',
    fontSize: Math.min(22, Math.max(17, width * 0.054)),
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
