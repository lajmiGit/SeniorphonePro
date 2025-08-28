import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window');

import { VirtualKeyboardProps } from '../types';

/**
 * Écran clavier avec 4 parties encadrées
 * Structure identique à l'écran de création de contact
 */
export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = () => {
  const [keyboardType, setKeyboardType] = useState<'abc' | '123' | 'symbols'>('abc');
  const [currentText, setCurrentText] = useState('');
  const [zone1Width, setZone1Width] = useState(0);

  const handleKeyboardTypeChange = (type: 'abc' | '123' | 'symbols') => {
    setKeyboardType(type);
  };

  const handleTextChange = (text: string) => {
    setCurrentText(prev => prev + text);
  };

  const handleDeleteText = () => {
    setCurrentText(prev => prev.slice(0, -1));
  };

  const handleKeyPress = (key: string) => {
    handleTextChange(key);
  };

  const handleZone1Layout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setZone1Width(width);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Partie 1: En-tête - 15% de la hauteur */}
        <View style={[styles.section, styles.headerSection]} onLayout={handleZone1Layout}>
          {/* Zone de saisie et bouton de suppression */}
          <View style={[styles.inputContainer, { 
            paddingHorizontal: width > 0 ? (width * 0.10) / 3 : 0 
          }]}>
            {/* Champ d'affichage des caractères saisis */}
            <View style={[styles.textDisplayField, { width: width * 0.60 }]}>
              <Text 
                style={[styles.textDisplayValue, { 
                  fontSize: Math.min(
                    Math.max(16, Math.floor(
                      (width * 0.60 * 0.15) / Math.max(1, currentText.length * 0.15)
                    )),
                    48 // Taille maximale
                  )
                }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {currentText || 'Aucun texte'}
              </Text>
            </View>
            
            {/* Bouton de suppression */}
            <TouchableOpacity style={[styles.deleteButton, { width: zone1Width * 0.20 }]} onPress={handleDeleteText}>
              <Text style={styles.deleteButtonText}>⌫</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Partie 2: Zone principale - 60% de la hauteur */}
        <View style={[styles.section, styles.mainSection]}>
          <View style={styles.keyboardContainer}>
            {/* Clavier ABC (caractères) */}
            {keyboardType === 'abc' && (
              <>
                {/* Première rangée : A, B, C, D, E, F */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('A')}>
                    <Text style={styles.keyboardKeyText}>A</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('B')}>
                    <Text style={styles.keyboardKeyText}>B</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('C')}>
                    <Text style={styles.keyboardKeyText}>C</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('D')}>
                    <Text style={styles.keyboardKeyText}>D</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('E')}>
                    <Text style={styles.keyboardKeyText}>E</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('F')}>
                    <Text style={styles.keyboardKeyText}>F</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Deuxième rangée : G, H, I, J, K, L */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('G')}>
                    <Text style={styles.keyboardKeyText}>G</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('H')}>
                    <Text style={styles.keyboardKeyText}>H</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('I')}>
                    <Text style={styles.keyboardKeyText}>I</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('J')}>
                    <Text style={styles.keyboardKeyText}>J</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('K')}>
                    <Text style={styles.keyboardKeyText}>K</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('L')}>
                    <Text style={styles.keyboardKeyText}>L</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Troisième rangée : M, N, O, P, Q, R */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('M')}>
                    <Text style={styles.keyboardKeyText}>M</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('N')}>
                    <Text style={styles.keyboardKeyText}>N</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('O')}>
                    <Text style={styles.keyboardKeyText}>O</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('P')}>
                    <Text style={styles.keyboardKeyText}>P</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('Q')}>
                    <Text style={styles.keyboardKeyText}>Q</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('R')}>
                    <Text style={styles.keyboardKeyText}>R</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Quatrième rangée : S, T, U, V, W, X */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('S')}>
                    <Text style={styles.keyboardKeyText}>S</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('T')}>
                    <Text style={styles.keyboardKeyText}>T</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('U')}>
                    <Text style={styles.keyboardKeyText}>U</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('V')}>
                    <Text style={styles.keyboardKeyText}>V</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('W')}>
                    <Text style={styles.keyboardKeyText}>W</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('X')}>
                    <Text style={styles.keyboardKeyText}>X</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Cinquième rangée : Y, Z */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('Y')}>
                    <Text style={styles.keyboardKeyText}>Y</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.keyboardKey} onPress={() => handleKeyPress('Z')}>
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
                  <TouchableOpacity style={[styles.keyboardKey, styles.numberKey]} onPress={() => handleKeyPress('1')}>
                    <Text style={[styles.keyboardKeyText, styles.numberKeyText]}>1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.numberKey]} onPress={() => handleKeyPress('2')}>
                    <Text style={[styles.keyboardKeyText, styles.numberKeyText]}>2</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.numberKey]} onPress={() => handleKeyPress('3')}>
                    <Text style={[styles.keyboardKeyText, styles.numberKeyText]}>3</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Deuxième rangée : 4, 5, 6 */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity style={[styles.keyboardKey, styles.numberKey]} onPress={() => handleKeyPress('4')}>
                    <Text style={[styles.keyboardKeyText, styles.numberKeyText]}>4</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.numberKey]} onPress={() => handleKeyPress('5')}>
                    <Text style={[styles.keyboardKeyText, styles.numberKeyText]}>5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.numberKey]} onPress={() => handleKeyPress('6')}>
                    <Text style={[styles.keyboardKeyText, styles.numberKeyText]}>6</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Troisième rangée : 7, 8, 9 */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity style={[styles.keyboardKey, styles.numberKey]} onPress={() => handleKeyPress('7')}>
                    <Text style={[styles.keyboardKeyText, styles.numberKeyText]}>7</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.numberKey]} onPress={() => handleKeyPress('8')}>
                    <Text style={[styles.keyboardKeyText, styles.numberKeyText]}>8</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.numberKey]} onPress={() => handleKeyPress('9')}>
                    <Text style={[styles.keyboardKeyText, styles.numberKeyText]}>9</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Quatrième rangée : *, 0, # */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity style={[styles.keyboardKey, styles.numberKey]} onPress={() => handleKeyPress('*')}>
                    <Text style={[styles.keyboardKeyText, styles.numberKeyText]}>*</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.numberKey]} onPress={() => handleKeyPress('0')}>
                    <Text style={[styles.keyboardKeyText, styles.numberKeyText]}>0</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.numberKey]} onPress={() => handleKeyPress('#')}>
                    <Text style={[styles.keyboardKeyText, styles.numberKeyText]}>#</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Clavier @#$ (caractères spéciaux) */}
            {keyboardType === 'symbols' && (
              <>
                {/* Première rangée : @, #, $, %, ^, & */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('@')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>@</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('#')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>#</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('$')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>$</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('%')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('^')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>^</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('&')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>&</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Deuxième rangée : *, (, ), -, +, = */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('*')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>*</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('(')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>(</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress(')')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('-')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('+')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('=')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>=</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Troisième rangée : [, ], {, }, |, \ */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('[')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>[</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress(']')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>]</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('{')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>{'{'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('}')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>{'}'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('|')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>|</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('\\')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>\</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Quatrième rangée : <, >, ?, /, ~, ` */}
                <View style={styles.keyboardRow}>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('<')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>{'<'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('>')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>{'>'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('?')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('/')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>/</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('~')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>~</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.keyboardKey, styles.symbolKey]} onPress={() => handleKeyPress('`')}>
                    <Text style={[styles.keyboardKeyText, styles.symbolKeyText]}>`</Text>
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
              style={[styles.selectorButton, keyboardType === 'abc' && styles.selectorButtonActive]}
              onPress={() => handleKeyboardTypeChange('abc')}
            >
              <Text style={[styles.selectorButtonText, keyboardType === 'abc' && styles.selectorButtonTextActive]}>
                ABC
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.selectorButton, keyboardType === '123' && styles.selectorButtonActive]}
              onPress={() => handleKeyboardTypeChange('123')}
            >
              <Text style={[styles.selectorButtonText, keyboardType === '123' && styles.selectorButtonTextActive]}>
                123
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.selectorButton, keyboardType === 'symbols' && styles.selectorButtonActive]}
              onPress={() => handleKeyboardTypeChange('symbols')}
            >
              <Text style={[styles.selectorButtonText, keyboardType === 'symbols' && styles.selectorButtonTextActive]}>
                @#$
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  
  // Partie 2: Zone principale (60% de la hauteur)
  mainSection: {
    height: height * 0.60, // 60% de la hauteur
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
    height: height * 0.10, // 10% de la hauteur
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFA000',
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 18,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  
  secondaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
  
  // Partie 4: Actions (20% de la hauteur)
  actionSection: {
    height: height * 0.20, // 20% de la hauteur
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#1976D2',
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 18,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  
  actionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
});
