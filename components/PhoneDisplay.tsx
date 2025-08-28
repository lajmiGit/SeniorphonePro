import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Modal, Animated } from 'react-native';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

interface PhoneDisplayProps {
  phoneNumber: string;
  onClear: () => void;
  onCall?: (phoneNumber: string) => void;
}

export const PhoneDisplay: React.FC<PhoneDisplayProps> = ({ phoneNumber, onClear, onCall }) => {
  const [showPhoneZoom, setShowPhoneZoom] = useState(false);
  const [showCallConfirmZoom, setShowCallConfirmZoom] = useState(false);
  const phoneZoomScale = useRef(new Animated.Value(0)).current;
  const phoneZoomOpacity = useRef(new Animated.Value(0)).current;
  const callConfirmScale = useRef(new Animated.Value(0)).current;
  const callConfirmOpacity = useRef(new Animated.Value(0)).current;

  // Configuration de la voix pour les seniors (claire et douce)
  const speechConfig = {
    language: 'fr-FR',
    pitch: 1.0,        // Voix naturelle
    rate: 0.7,         // Vitesse lente pour les seniors
    volume: 0.8,       // Volume confortable
    voice: 'com.apple.ttsbundle.Samantha-compact', // Voix claire sur iOS
  };

  const formatPhoneNumber = (number: string) => {
    if (number.length === 0) return '';
    
    // Formatage pour la lisibilité (ajout d'espaces tous les 2 chiffres)
    const formatted = number.replace(/(\d{2})(?=\d)/g, '$1 ');
    return formatted;
  };

  // Ouvrir le zoom du numéro
  const handlePhonePress = () => {
    if (phoneNumber.length > 0) {
      setShowPhoneZoom(true);
      // Animation d'entrée avec zoom et fade
      Animated.parallel([
        Animated.timing(phoneZoomScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(phoneZoomOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Lecture automatique du numéro
      setTimeout(() => speakPhoneNumber(), 350);
    }
  };

  // Fermer le zoom du numéro
  const closePhoneZoom = () => {
    // Arrêter la parole
    Speech.stop();
    
    // Animation de sortie
    Animated.parallel([
      Animated.timing(phoneZoomScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(phoneZoomOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowPhoneZoom(false);
    });
  };

  // Ouvrir le zoom de confirmation d'appel
  const handleCallPress = () => {
    if (phoneNumber.length > 0) {
      setShowCallConfirmZoom(true);
      // Animation d'entrée avec zoom et fade
      Animated.parallel([
        Animated.timing(callConfirmScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(callConfirmOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Lecture automatique de la confirmation
      setTimeout(() => speakCallConfirm(), 350);
    }
  };

  // Fermer le zoom de confirmation d'appel
  const closeCallConfirmZoom = () => {
    // Arrêter la parole
    Speech.stop();
    
    // Animation de sortie
    Animated.parallel([
      Animated.timing(callConfirmScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(callConfirmOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCallConfirmZoom(false);
    });
  };

  // Confirmer l'appel
  const confirmCall = () => {
    // Ici vous pouvez ajouter la logique pour lancer l'appel
    console.log('📞 Appel confirmé pour le numéro:', phoneNumber);
    closeCallConfirmZoom();
    // Vous pouvez ajouter une fonction pour lancer l'appel réel
    onCall?.(phoneNumber);
  };

  // Annuler l'appel
  const cancelCall = () => {
    console.log('❌ Appel annulé');
    closeCallConfirmZoom();
  };

  // Lire le numéro de téléphone
  const speakPhoneNumber = () => {
    try {
      const formattedNumber = formatPhoneNumber(phoneNumber);
      const message = `Numéro composé : ${formattedNumber}`;
      
      console.log('📞 Fonction speakPhoneNumber appelée');
      console.log('📞 Numéro reçu:', phoneNumber);
      console.log('📞 Message généré:', message);
      console.log('📞 Configuration voix:', speechConfig);
      
      Speech.speak(message, speechConfig);
      console.log('📞 Synthèse vocale lancée avec succès');
    } catch (error) {
      console.error('📞 Erreur lors de la synthèse vocale:', error);
    }
  };

  // Lire la confirmation d'appel
  const speakCallConfirm = () => {
    try {
      const formattedNumber = formatPhoneNumber(phoneNumber);
      const message = `Voulez-vous lancer un appel vers ${formattedNumber} ?`;
      
      console.log('📞 Fonction speakCallConfirm appelée');
      console.log('📞 Numéro reçu:', phoneNumber);
      console.log('📞 Message généré:', message);
      console.log('📞 Configuration voix:', speechConfig);
      
      Speech.speak(message, speechConfig);
      console.log('📞 Synthèse vocale de confirmation lancée avec succès');
    } catch (error) {
      console.error('📞 Erreur lors de la synthèse vocale de confirmation:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.inputContainer} 
        onPress={handlePhonePress}
        activeOpacity={0.8}
      >
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
      </TouchableOpacity>
      
      {phoneNumber.length > 0 && (
        <View style={styles.numberInfo}>
          <Text style={styles.numberLength}>
            {phoneNumber.length} chiffre{phoneNumber.length > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Modal de zoom du numéro de téléphone */}
      <Modal
        visible={showPhoneZoom}
        transparent={true}
        animationType="none"
        onRequestClose={closePhoneZoom}
      >
        <TouchableOpacity 
          style={styles.zoomOverlay} 
          activeOpacity={1} 
          onPress={closePhoneZoom}
        >
          <Animated.View 
            style={[
              styles.zoomContainer,
              {
                transform: [{ scale: phoneZoomScale }],
                opacity: phoneZoomOpacity,
              }
            ]}
          >
            <View style={styles.zoomPhoneCard}>
              {/* Titre du zoom */}
              <Text style={styles.zoomPhoneTitle}>
                📞
              </Text>
              
              {/* Numéro de téléphone en grand */}
              <View style={styles.zoomPhoneNumberSection}>
                <Text style={styles.zoomPhoneNumber}>
                  {formatPhoneNumber(phoneNumber)}
                </Text>
              </View>
              
              {/* Informations du numéro */}
              <View style={styles.zoomPhoneInfoSection}>
                <Text style={styles.zoomPhoneInfo}>
                  {phoneNumber.length} chiffre{phoneNumber.length > 1 ? 's' : ''} composé{phoneNumber.length > 1 ? 's' : ''}
                </Text>
              </View>
              
              {/* Bouton de lecture vocale */}
              <View style={styles.zoomPhoneButtonSection}>
                <TouchableOpacity 
                  style={styles.zoomVoiceButton}
                  onPress={speakPhoneNumber}
                  activeOpacity={0.8}
                >
                  <Text style={styles.zoomVoiceButtonText}>
                    🔊 Relire le numéro
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Instructions de fermeture */}
              <View style={styles.zoomPhoneCloseSection}>
                <Text style={styles.zoomInfoText}>
                  Appuyez n'importe où pour fermer
                </Text>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de confirmation d'appel */}
      <Modal
        visible={showCallConfirmZoom}
        transparent={true}
        animationType="none"
        onRequestClose={closeCallConfirmZoom}
      >
        <TouchableOpacity 
          style={styles.zoomOverlay} 
          activeOpacity={1} 
          onPress={closeCallConfirmZoom}
        >
          <Animated.View 
            style={[
              styles.zoomContainer,
              {
                transform: [{ scale: callConfirmScale }],
                opacity: callConfirmOpacity,
              }
            ]}
          >
            <View style={styles.zoomCallConfirmCard}>
              {/* Section Titre (30% de la hauteur) */}
              <View style={styles.zoomCallConfirmTitleSection}>
                <Text style={styles.zoomCallConfirmIcon}>📞</Text>
                <Text style={styles.zoomCallConfirmTitle}>
                  Confirmation d'appel
                </Text>
              </View>
              
              {/* Section Numéro (30% de la hauteur) */}
              <View style={styles.zoomCallConfirmNumberSection}>
                <Text style={styles.zoomCallConfirmNumber}>
                  {formatPhoneNumber(phoneNumber)}
                </Text>
              </View>
              
              {/* Section Question (20% de la hauteur) */}
              <View style={styles.zoomCallConfirmQuestionSection}>
                <Text style={styles.zoomCallConfirmQuestion}>
                  Voulez-vous lancer cet appel ?
                </Text>
              </View>
              
              {/* Section Boutons (20% de la hauteur) */}
              <View style={styles.zoomCallConfirmButtonsSection}>
                <TouchableOpacity 
                  style={styles.zoomCallConfirmButton}
                  onPress={confirmCall}
                  activeOpacity={0.8}
                >
                  <Text style={styles.zoomCallConfirmButtonText}>
                    Oui
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.zoomCallCancelButton}
                  onPress={cancelCall}
                  activeOpacity={0.8}
                >
                  <Text style={styles.zoomCallCancelButtonText}>
                    Non
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
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
  // Styles pour le modal de zoom
  zoomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  zoomPhoneCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    padding: Math.min(30, Math.max(20, width * 0.06)),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // Effet 3D moderne
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    // Dimensions exactes comme les autres zooms
    width: width * 0.9, // 90% de la largeur de l'écran
    height: height * 0.8, // 80% de la hauteur de l'écran
    // Centrage parfait
    alignSelf: 'center',
    // Assure que le contenu reste dans les limites
    overflow: 'hidden',
  },
  zoomPhoneTitle: {
    fontSize: Math.min(48, Math.max(32, width * 0.12)),
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 25,
    includeFontPadding: false,
    textAlignVertical: 'center',
    height: '30%', // 30% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomPhoneNumberSection: {
    height: '30%', // 30% de la hauteur du cadre zoom (au lieu de 40%)
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomPhoneNumber: {
    fontSize: Math.min(72, Math.max(48, width * 0.15)),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  zoomPhoneInfoSection: {
    height: '20%', // 20% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomPhoneInfo: {
    fontSize: Math.min(24, Math.max(18, width * 0.06)),
    color: '#666',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  zoomPhoneButtonSection: {
    height: '10%', // 10% de la hauteur du cadre zoom (au lieu de 20%)
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomVoiceButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  zoomVoiceButtonText: {
    color: 'white',
    fontSize: Math.min(18, Math.max(14, width * 0.045)),
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  zoomPhoneCloseSection: {
    height: '10%', // 10% de la hauteur du cadre zoom (au lieu de 20%)
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomInfoText: {
    fontSize: Math.min(16, Math.max(12, width * 0.04)),
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  // Styles pour le modal de confirmation d'appel
  zoomCallConfirmCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    padding: Math.min(30, Math.max(20, width * 0.06)),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // Effet 3D moderne
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    // Dimensions exactes comme les autres zooms
    width: width * 0.9, // 90% de la largeur de l'écran
    height: height * 0.8, // 80% de la hauteur de l'écran
    // Centrage parfait
    alignSelf: 'center',
    // Assure que le contenu reste dans les limites
    overflow: 'hidden',
  },
  zoomCallConfirmTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  zoomCallConfirmIcon: {
    fontSize: Math.min(48, Math.max(36, width * 0.12)),
    marginRight: 10,
  },
  zoomCallConfirmTitle: {
    fontSize: Math.min(36, Math.max(28, width * 0.1)),
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  zoomCallConfirmNumberSection: {
    height: '30%', // 30% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomCallConfirmNumber: {
    fontSize: Math.min(72, Math.max(48, width * 0.15)),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  zoomCallConfirmQuestionSection: {
    height: '20%', // 20% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomCallConfirmQuestion: {
    fontSize: Math.min(24, Math.max(18, width * 0.06)),
    color: '#666',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  zoomCallConfirmButtonsSection: {
    height: '20%', // 20% de la hauteur du cadre zoom
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  zoomCallConfirmButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  zoomCallConfirmButtonText: {
    color: 'white',
    fontSize: Math.min(18, Math.max(14, width * 0.045)),
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  zoomCallCancelButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  zoomCallCancelButtonText: {
    color: 'white',
    fontSize: Math.min(18, Math.max(14, width * 0.045)),
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
