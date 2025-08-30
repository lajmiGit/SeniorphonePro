import React, { useState, useEffect, useRef, Suspense } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Vibration,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import * as Battery from 'expo-battery';
import * as Speech from 'expo-speech';

import * as Linking from 'expo-linking';
import { SystemInfo } from './components/SystemInfo';
import { PhoneDisplay } from './components/PhoneDisplay';
import { DialPad } from './components/DialPad';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy Loading des composants lourds
const ContactList = React.lazy(() => 
  import('./components/ContactList').then(module => ({ default: module.ContactList }))
);
const NavigationScreen = React.lazy(() => import('./components/NavigationScreen'));
const CreateContactScreen = React.lazy(() => 
  import('./components/CreateContactScreen').then(module => ({ default: module.CreateContactScreen }))
);

const { height } = Dimensions.get('window');

export default function App() {
  // État de l'application
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCallConfirmZoom, setShowCallConfirmZoom] = useState(false);
  const [networkLevel, setNetworkLevel] = useState(4);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [currentScreen, setCurrentScreen] = useState<
    'navigation' | 'contacts' | 'phone' | 'createContact'
  >('navigation');

  // Animation pour l'effet de clic
  const callButtonScale = useRef(new Animated.Value(1)).current;
  const homeButtonScale = useRef(new Animated.Value(1)).current;

  // Configuration de la voix pour les seniors (claire et douce)
  const speechConfig = {
    language: 'fr-FR',
    pitch: 1.0, // Voix naturelle
    rate: 0.8, // Vitesse à 80% (un peu plus rapide)
    volume: 0.8, // Volume confortable
    voice: 'com.apple.ttsbundle.Samantha-compact', // Voix claire sur iOS
  };

  // Fonction pour gérer la synthèse vocale de manière propre
  const speakCallConfirmation = () => {
    try {
      // Arrêter toute synthèse vocale en cours avec délai pour s'assurer qu'elle s'arrête
      Speech.stop();
      
      // Attendre un peu avant de relancer pour s'assurer que l'arrêt est effectif
      setTimeout(() => {
        const formattedNumber = phoneNumber.replace(/(\d{2})(?=\d)/g, '$1 ');
        const message = `Voulez-vous appeler ${formattedNumber} ? Si oui, appuyez sur le bouton vert. Sinon, appuyez sur le bouton rouge.`;
        
        console.log('📞 Fonction speakCallConfirmation appelée');
        console.log('📞 Numéro reçu:', phoneNumber);
        console.log('📞 Message généré:', message);
        
        Speech.speak(message, speechConfig);
        console.log('📞 Synthèse vocale lancée avec succès');
      }, 100); // Délai de 100ms pour s'assurer que l'arrêt est effectif
    } catch (error) {
      console.error('📞 Erreur lors de la synthèse vocale:', error);
    }
  };

  const addNumber = (num: string) => {
    if (phoneNumber.length < 15) {
      // Limite à 15 chiffres
      setPhoneNumber(prev => prev + num);
      // Vibration tactile pour feedback
      Vibration.vibrate(50);
    }
  };

  // Supprimer le dernier chiffre composé
  const deleteDigit = () => {
    if (phoneNumber.length > 0) {
      setPhoneNumber(phoneNumber.slice(0, -1));

      // Animation de clic
      Animated.sequence([
        Animated.timing(callButtonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(callButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Vibration tactile
      Vibration.vibrate(100);
    }
  };

  // Gérer le retour à l'accueil
  const handleHomePress = () => {
    // Animation de clic pour le bouton accueil
    Animated.sequence([
      Animated.timing(homeButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(homeButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Vibration tactile
    Vibration.vibrate(100);

    // Retour à l'écran de navigation
    setCurrentScreen('navigation');
  };

  const handleContactSelect = (contact: any) => {
    setPhoneNumber(contact.phoneNumber.replace(/\s/g, '')); // Supprime les espaces
    setCurrentScreen('phone');
    Vibration.vibrate(100);
  };

  const navigateToContacts = () => {
    setCurrentScreen('contacts');
  };

  const navigateToPhone = () => {
    setCurrentScreen('phone');
  };

  const navigateToCreateContact = () => {
    setCurrentScreen('createContact');
  };

  const handleContactCreated = () => {
    setCurrentScreen('contacts');
    // Optionnel : recharger la liste des contacts
  };

  const makeCall = () => {
    if (phoneNumber.length > 0) {
      // Animation de clic
      Animated.sequence([
        Animated.timing(callButtonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(callButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Vibration tactile
      Vibration.vibrate(150);

      // Ouvrir le zoom de confirmation d'appel
      setShowCallConfirmZoom(true);

      // Synthèse vocale automatique après 350ms
      setTimeout(() => {
        speakCallConfirmation();
      }, 350);
    }
  };

  // Confirmer l'appel
  const confirmCall = () => {
    console.log('=== DÉBUT CONFIRMATION APPEL ===');
    console.log('Numéro à appeler:', phoneNumber);
    console.log('Type du numéro:', typeof phoneNumber);
    console.log('Longueur du numéro:', phoneNumber.length);

    // Arrêter la synthèse vocale de manière robuste
    try {
      Speech.stop();
      console.log('🔇 Synthèse vocale arrêtée');
      
      // Attendre un peu pour s'assurer que l'arrêt est effectif
      setTimeout(() => {
        Speech.stop(); // Double arrêt pour s'assurer
        console.log('🔇 Double arrêt de la synthèse vocale');
      }, 50);
    } catch (error) {
      console.error('❌ Erreur lors de l\'arrêt de la synthèse vocale:', error);
    }

    setShowCallConfirmZoom(false);

    // Lancement simple et efficace de l'appel
    try {
      const phoneUrl = `tel:${phoneNumber}`;
      console.log('URL téléphone générée:', phoneUrl);
      console.log("Tentative de lancement de l'appel...");
      Linking.openURL(phoneUrl);
      console.log('✅ Appel lancé vers:', phoneNumber);
      
    } catch (error) {
      console.error("❌ Erreur lors du lancement de l'appel:", error);
      Alert.alert(
        'Erreur',
        "Impossible de lancer l'appel. Vérifiez que votre téléphone peut passer des appels.",
        [{ text: 'OK' }]
      );
    }

    console.log('=== FIN CONFIRMATION APPEL ===');
  };

  // Annuler l'appel
  const cancelCall = () => {
    console.log('Appel annulé');
    // Arrêter la synthèse vocale de manière robuste
    try {
      Speech.stop();
      console.log('🔇 Synthèse vocale arrêtée');
      
      // Attendre un peu pour s'assurer que l'arrêt est effectif
      setTimeout(() => {
        Speech.stop(); // Double arrêt pour s'assurer
        console.log('🔇 Double arrêt de la synthèse vocale');
      }, 50);
    } catch (error) {
      console.error('❌ Erreur lors de l\'arrêt de la synthèse vocale:', error);
    }
    setShowCallConfirmZoom(false);
  };

  // Suppression de la fonction launchRealCall qui n'est plus nécessaire

  // Simulation des changements de niveau réseau et batterie
  // Récupération initiale de la batterie
  useEffect(() => {
    const getInitialBattery = async () => {
      try {
        const batteryLevel = await Battery.getBatteryLevelAsync();
        setBatteryLevel(Math.round(batteryLevel * 100)); // Convertit en pourcentage (0-100)
      } catch (error) {
        console.log(
          'Erreur lors de la récupération initiale de la batterie:',
          error
        );
      }
    };

    // Récupération immédiate de la batterie
    getInitialBattery();
  }, []);

  useEffect(() => {
    const networkTimer = setInterval(() => {
      setNetworkLevel(prev => {
        const newLevel = prev + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(1, Math.min(4, newLevel));
      });
    }, 10000);

    const batteryTimer = setInterval(async () => {
      try {
        const batteryLevel = await Battery.getBatteryLevelAsync();
        setBatteryLevel(Math.round(batteryLevel * 100)); // Convertit en pourcentage (0-100)
      } catch (error) {
        console.log('Erreur lors de la récupération de la batterie:', error);
        // En cas d'erreur, on garde la valeur précédente
      }
    }, 10000); // Mise à jour toutes les 10 secondes

    return () => {
      clearInterval(networkTimer);
      clearInterval(batteryTimer);
    };
  }, []);

  // Surveiller les changements de showFloatingButton pour déboguer
  // useEffect(() => {
  //   console.log('🔍 État showFloatingButton changé:', showFloatingButton); // Supprimé
  // }, []); // Supprimé

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent={true}
      />

      {/* Écran de contacts */}
      {currentScreen === 'contacts' && (
        <View style={styles.contactsContainer}>
          <Suspense
            fallback={<LoadingSpinner message='Chargement des contacts...' />}
          >
            <ContactList
              onContactSelect={handleContactSelect}
              onCreateContact={navigateToCreateContact}
              onHomePress={() => setCurrentScreen('navigation')}
            />
          </Suspense>
        </View>
      )}

      {/* Écran principal du téléphone */}
      {currentScreen === 'phone' && (
        <>
          {/* Partie 1: Bouton Accueil (10% de la hauteur) */}
          <View style={[styles.section, styles.homeSection]}>
            <TouchableOpacity
              style={styles.homeButton}
              activeOpacity={0.8}
              onPress={handleHomePress}
            >
              <Animated.View
                style={{ transform: [{ scale: homeButtonScale }] }}
              >
                <Text style={styles.homeButtonText}>🏠 Accueil</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Partie 2: Informations système (15% de la hauteur) */}
          <View style={[styles.section, styles.infoSection]}>
            <SystemInfo
              networkLevel={networkLevel}
              batteryLevel={batteryLevel}
            />
          </View>

          {/* Partie 3: Champ téléphone (10% de la hauteur) */}
          <View style={[styles.section, styles.phoneSection]}>
            <PhoneDisplay
              phoneNumber={phoneNumber}
              onDeleteDigit={deleteDigit}
            />
          </View>

          {/* Partie 4: Pavé numérique (55% de la hauteur) */}
          <View style={[styles.section, styles.dialPadSection]}>
            <DialPad onNumberPress={addNumber} />
          </View>

          {/* Partie 5: Bouton Appeler (10% de la hauteur) */}
          <View style={[styles.section, styles.callSection]}>
            <TouchableOpacity
              testID='call-button'
              style={[
                styles.callButton,
                { opacity: phoneNumber.length > 0 ? 1 : 0.5 },
              ]}
              onPress={makeCall}
              disabled={phoneNumber.length === 0}
              activeOpacity={0.8}
            >
              <Animated.View
                style={{ transform: [{ scale: callButtonScale }] }}
              >
                <Text style={styles.callButtonText}>📞 Appeler</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Zoom de confirmation d'appel */}
      {showCallConfirmZoom && (
        <Modal
          visible={showCallConfirmZoom}
          transparent={true}
          animationType='none'
          onRequestClose={cancelCall}
        >
          <TouchableOpacity
            style={styles.zoomOverlay}
            activeOpacity={1}
            onPress={cancelCall}
          >
            <View style={styles.zoomCallConfirmCard}>
              {/* Section Titre */}
              <View style={styles.zoomCallConfirmTitleSection}>
                <Text style={styles.zoomCallConfirmIcon}>📞</Text>
                <Text style={styles.zoomCallConfirmTitle}>
                  Confirmation d'appel
                </Text>
              </View>

              {/* Section Numéro */}
              <View style={styles.zoomCallConfirmNumberSection}>
                <Text style={styles.zoomCallConfirmNumber}>{phoneNumber}</Text>
              </View>

              {/* Section Question */}
              <View style={styles.zoomCallConfirmQuestionSection}>
                <Text style={styles.zoomCallConfirmQuestion}>
                  Voulez-vous lancer cet appel ?
                </Text>
              </View>

              {/* Section Synthèse Vocale */}
              <View style={styles.zoomCallConfirmVoiceSection}>
                <TouchableOpacity
                  style={styles.zoomCallConfirmVoiceButton}
                  onPress={speakCallConfirmation}
                  activeOpacity={0.8}
                >
                  <Text style={styles.zoomCallConfirmVoiceButtonText}>
                    🔊 Relire les instructions
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Section Boutons */}
              <View style={styles.zoomCallConfirmButtonsSection}>
                <TouchableOpacity
                  style={[
                    styles.zoomCallConfirmButton,
                    { backgroundColor: '#F44336' },
                  ]}
                  onPress={cancelCall}
                >
                  <Text
                    style={styles.zoomCallConfirmButtonText}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    Non
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.zoomCallConfirmButton,
                    { backgroundColor: '#4CAF50' },
                  ]}
                  onPress={confirmCall}
                >
                  <Text
                    style={styles.zoomCallConfirmButtonText}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    Oui
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Section Instructions de fermeture */}
              <View style={styles.zoomCallConfirmCloseSection}>
                <Text style={styles.zoomInfoText}>
                  Appuyez n'importe où pour fermer
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Écran de navigation */}
      {currentScreen === 'navigation' && (
        <Suspense fallback={<LoadingSpinner message='Chargement du menu...' />}>
          <NavigationScreen
            onNavigateToContacts={navigateToContacts}
            onNavigateToPhone={navigateToPhone}
            onNavigateToCreateContact={navigateToCreateContact}
          />
        </Suspense>
      )}

      {/* Écran de création de contact */}
      {currentScreen === 'createContact' && (
        <Suspense
          fallback={<LoadingSpinner message='Chargement du formulaire...' />}
        >
          <CreateContactScreen
            onContactCreated={handleContactCreated}
            onCancel={() => setCurrentScreen('contacts')}
            onHomePress={() => setCurrentScreen('navigation')}
          />
        </Suspense>
      )}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Blanc cassé - moins agressif pour les yeux seniors
    paddingTop: Platform.OS === 'ios' ? 50 : 30, // Espace manuel pour la Status Bar
  },
  section: {
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 12,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  homeSection: {
    height: height * 0.1,
    backgroundColor: '#4CAF50', // Vert principal - meilleure perception
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    // Effet 3D plus subtil avec bordures moins contrastées
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
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
  infoSection: {
    height: height * 0.15,
    backgroundColor: '#4CAF50', // Vert principal - meilleure perception
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    // Effet 3D plus subtil avec bordures moins contrastées
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
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
  phoneSection: {
    height: height * 0.1,
    backgroundColor: '#FFC107', // Jaune principal - très visible même avec presbytie
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFA000',
  },
  dialPadSection: {
    height: height * 0.55, // Hauteur originale restaurée
    backgroundColor: '#FF9800', // Orange principal - bon compromis visibilité/fatigue
    justifyContent: 'space-around',
    borderWidth: 2,
    borderColor: '#F57C00',
  },
  callSection: {
    height: height * 0.1,
    backgroundColor: '#4CAF50', // Vert principal - logique pour "Appeler" et excellent pour les seniors
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#388E3C',
  },
  homeButton: {
    width: '95%',
    height: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Plus opaque pour meilleur contraste
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    // Style plat sans effet 3D
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  homeButtonText: {
    color: '#FFFFFF', // Blanc pur pour contraste optimal
    fontSize: 22, // Plus grand pour s'adapter au bouton agrandi
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)', // Ombre plus prononcée
    textShadowOffset: { width: 2, height: 2 }, // Ombre plus décalée
    textShadowRadius: 3, // Ombre plus étendue
  },
  callButton: {
    width: '95%',
    height: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Encore plus opaque pour meilleur contraste
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    // Effet 3D plus subtil avec bordures moins contrastées
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  callButtonText: {
    color: '#FFFFFF', // Blanc pur pour contraste optimal
    fontSize: 22, // Plus grand pour s'adapter au bouton agrandi
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)', // Ombre plus prononcée
    textShadowOffset: { width: 2, height: 2 }, // Ombre plus décalée
    textShadowRadius: 3, // Ombre plus étendue
  },
  contactsContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  zoomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomCallConfirmCard: {
    width: '80%', // 80% de la largeur de l'écran
    height: '80%', // 80% de la hauteur de l'écran
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  zoomCallConfirmTitleSection: {
    height: '10%', // 10% de la hauteur du zoom
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  zoomCallConfirmIcon: {
    fontSize: Math.min(36, Math.max(24, Dimensions.get('window').width * 0.08)),
    marginRight: 10,
  },
  zoomCallConfirmTitle: {
    fontSize: Math.min(20, Math.max(16, Dimensions.get('window').width * 0.05)),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  zoomCallConfirmNumberSection: {
    height: '20%', // 20% de la hauteur du zoom
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 10,
    width: '100%',
  },
  zoomCallConfirmNumber: {
    fontSize: Math.min(72, Math.max(48, Dimensions.get('window').width * 0.15)),
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: Math.min(80, Math.max(56, Dimensions.get('window').width * 0.17)),
  },
  zoomCallConfirmQuestionSection: {
    height: '10%', // 10% de la hauteur du zoom
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  zoomCallConfirmQuestion: {
    fontSize: Math.min(18, Math.max(14, Dimensions.get('window').width * 0.045)),
    color: '#666',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  zoomCallConfirmVoiceSection: {
    height: '15%', // 15% de la hauteur du zoom
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  zoomCallConfirmVoiceButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: Math.min(20, Math.max(15, Dimensions.get('window').width * 0.05)),
    paddingVertical: Math.min(10, Math.max(8, Dimensions.get('window').height * 0.01)),
    borderRadius: Math.min(20, Math.max(15, Dimensions.get('window').width * 0.05)),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  zoomCallConfirmVoiceButtonText: {
    color: 'white',
    fontSize: Math.min(16, Math.max(12, Dimensions.get('window').width * 0.04)),
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  zoomCallConfirmButtonsSection: {
    height: '30%', // 30% de la hauteur du zoom
    flexDirection: 'row',
    justifyContent: 'center', // Centrage parfait des éléments
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 0, // Pas de padding pour éviter les décalages
    width: '100%', // Assure que la section prend toute la largeur disponible
  },
  zoomCallConfirmButton: {
    paddingVertical: Math.min(25, Math.max(20, Dimensions.get('window').height * 0.03)),
    paddingHorizontal: Math.min(20, Math.max(15, Dimensions.get('window').width * 0.05)),
    borderRadius: Math.min(15, Math.max(12, Dimensions.get('window').width * 0.04)),
    width: '40%', // Chaque bouton occupe exactement 40% de la largeur du zoom
    minHeight: Math.min(80, Math.max(60, Dimensions.get('window').height * 0.1)),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Assure que la largeur est respectée
    flex: 0, // Empêche le flex de modifier la largeur
    alignSelf: 'stretch', // Étire le bouton sur sa largeur définie
    marginHorizontal: '2.5%', // Marge de 2.5% de chaque côté
    overflow: 'hidden', // Empêche le débordement
  },
  zoomCallConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: Math.min(14, Math.max(12, Dimensions.get('window').width * 0.035)),
    fontWeight: 'bold',
    textAlign: 'center', // Centrage du texte
    includeFontPadding: false, // Supprime le padding automatique
    textAlignVertical: 'center', // Centrage vertical
    flexShrink: 1, // Permet au texte de se rétrécir si nécessaire
    flexWrap: 'nowrap', // Empêche le retour à la ligne
    // Propriétés supplémentaires pour forcer une ligne
    lineHeight: Math.min(16, Math.max(14, Dimensions.get('window').width * 0.04)),
    maxWidth: '100%', // Largeur maximale du texte
  },
  zoomCallConfirmButtonSpacer: {
    width: '10%', // Espace de 10% de la largeur du zoom entre les boutons
  },
  zoomCallConfirmButtonSpacerSmall: {
    width: '5%', // Espace de 5% de la largeur du zoom
  },
  zoomCallConfirmCloseSection: {
    height: '15%', // 15% de la hauteur du zoom
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomInfoText: {
    fontSize: Math.min(18, Math.max(14, Dimensions.get('window').width * 0.045)),
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
