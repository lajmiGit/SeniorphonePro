import React from 'react';
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Partie 1: En-tête - 15% de la hauteur */}
        <View style={[styles.section, styles.headerSection]}>
          <Text style={styles.headerTitle}>⌨️ Clavier Virtuel</Text>
          <Text style={styles.headerSubtitle}>Saisie de texte</Text>
        </View>

        {/* Partie 2: Zone principale - 60% de la hauteur */}
        <View style={[styles.section, styles.mainSection]}>
          <View style={styles.keyboardContainer}>
            {/* Première rangée : 1, 2, 3 */}
            <View style={styles.keyboardRow}>
              <TouchableOpacity style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>3</Text>
              </TouchableOpacity>
            </View>
            
            {/* Deuxième rangée : 4, 5, 6 */}
            <View style={styles.keyboardRow}>
              <TouchableOpacity style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>4</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>6</Text>
              </TouchableOpacity>
            </View>
            
            {/* Troisième rangée : 7, 8, 9 */}
            <View style={styles.keyboardRow}>
              <TouchableOpacity style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>9</Text>
              </TouchableOpacity>
            </View>
            
            {/* Quatrième rangée : *, 0, # */}
            <View style={styles.keyboardRow}>
              <TouchableOpacity style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>*</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>#</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Partie 3: Zone secondaire - 10% de la hauteur */}
        <View style={[styles.section, styles.secondarySection]}>
          <Text style={styles.secondaryText}>Zone secondaire</Text>
        </View>

        {/* Partie 4: Actions - 20% de la hauteur */}
        <View style={[styles.section, styles.actionSection]}>
          <Text style={styles.actionText}>Boutons d'action</Text>
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
  
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 5,
  },
  
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
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
  },

  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
  },

  keyboardKey: {
    width: Math.min(80, (width - 80) / 3), // 3 touches par ligne avec marges
    height: Math.min(80, (height * 0.6 - 120) / 4), // 4 rangées avec espacement
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderWidth: 3,
    borderColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(224, 224, 224, 0.6)',
    borderBottomColor: 'rgba(224, 224, 224, 0.6)',
  },

  keyboardKeyText: {
    fontSize: Math.max(24, Math.min(80, (height * 0.6 - 120) / 4) * 0.4),
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
});
