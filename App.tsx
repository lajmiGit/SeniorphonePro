import React, { useState, useEffect, useRef } from 'react';
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
import * as Network from 'expo-network';
import * as Cellular from 'expo-cellular';
import WifiManager from 'react-native-wifi-reborn';

import { ContactList } from './components/ContactList';
import { NavigationScreen } from './components/NavigationScreen';
import { CreateContactScreen } from './components/CreateContactScreen';

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
  const [networkType, setNetworkType] = useState<'wifi' | 'mobile' | 'none'>('none');
  const [networkInfo, setNetworkInfo] = useState({
    wifi: { available: false, level: 0, type: 'wifi' },
    mobile: { available: false, level: 0, type: 'mobile' },
    primary: 'none' as 'wifi' | 'mobile' | 'none',
    mobileDataEnabled: false
  });
  
  // État pour contrôler la MAJ pendant la lecture vocale
  const [isSpeaking, setIsSpeaking] = useState(false);

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
    detectNetworkState();
  }, []);

  useEffect(() => {
    // Timer pour la détection réseau (toutes les 5 secondes) - PAUSE si lecture vocale
    const networkTimer = setInterval(() => {
      if (!isSpeaking) {
        detectNetworkState();
      } else {
        console.log('🔇 MAJ réseau ignorée (lecture vocale en cours)');
      }
    }, 5000);

    // Timer pour la batterie (toutes les 10 secondes)
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
  }, [isSpeaking]);

  // Fonction pour récupérer le niveau de signal WiFi réel (version simplifiée)
  const getRealWifiSignal = async () => {
    try {
      // Vérifier d'abord si on est sur WiFi
      const networkState = await Network.getNetworkStateAsync();
      if (networkState.type !== Network.NetworkStateType.WIFI) {
        console.log('📶 Pas sur WiFi, retour niveau 0');
        return 0;
      }

      // Essayer d'utiliser react-native-wifi-reborn
      try {
        const signalStrength = await WifiManager.getCurrentSignalStrength();
        console.log('📶 Force du signal WiFi:', signalStrength, 'dBm');
        
        // Convertir RSSI en niveau 0-4
        if (signalStrength >= -30) return 4; // Excellent
        if (signalStrength >= -50) return 3; // Bon
        if (signalStrength >= -70) return 2; // Moyen
        if (signalStrength >= -90) return 1; // Faible
        return 0; // Très faible
      } catch (wifiError) {
        console.log('❌ react-native-wifi-reborn non disponible, utilisation simulation');
        
        // Fallback : simulation basée sur la qualité de connexion
        if (networkState.isConnected && networkState.isInternetReachable) {
          return 4; // Excellent si connecté + internet
        } else if (networkState.isConnected) {
          return 2; // Moyen si connecté mais pas internet
        } else {
          return 1; // Faible si pas connecté
        }
      }
    } catch (error) {
      console.log('❌ Erreur générale getRealWifiSignal:', error);
      return 0;
    }
  };

  // Fonction pour mesurer la latence réseau
  const measureLatency = async () => {
    const startTime = Date.now();
    try {
      // Créer un AbortController pour gérer le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes max
      
      await fetch('https://www.google.com', { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return Date.now() - startTime;
    } catch (error) {
      console.log('❌ Erreur mesure latence:', error);
      return 1000; // Latence élevée en cas d'erreur
    }
  };

  // Fonction pour détecter si les données mobiles sont activées
  const getMobileDataStatus = async () => {
    try {
      const cellularState = await Cellular.getCellularGenerationAsync();
      console.log('📱 Génération cellulaire:', cellularState);
      
      // Si cellularState existe, les données mobiles sont activées par l'utilisateur
      const isEnabled = cellularState !== null;
      console.log('📱 Données mobiles (paramètres utilisateur):', isEnabled ? 'Activées' : 'Désactivées');
      return isEnabled;
    } catch (error) {
      console.log('❌ Erreur détection statut données mobiles:', error);
      return false; // Par défaut, considérer comme désactivé
    }
  };

  // Fonction pour obtenir le niveau physique 4G/5G (toujours mesuré)
  const getPhysicalMobileSignal = async () => {
    try {
      // Vérifier si 4G/5G est physiquement disponible
      const carrierName = await Cellular.getCarrierNameAsync();
      console.log('📱 Opérateur détecté:', carrierName);
      
      if (carrierName === null) {
        // 4G/5G non disponible physiquement
        console.log('📱 4G/5G non disponible physiquement');
        return -1; // Non disponible
      }
      
      // 4G/5G est physiquement disponible (carrierName existe)
      // Toujours mesurer le niveau physique même si désactivée
      const latency = await measureLatency();
      console.log('📱 Latence physique 4G/5G:', latency, 'ms');
      
      // Convertir la latence en niveau 0-4
      if (latency < 150) return 4; // Excellent
      if (latency < 300) return 3; // Bon
      if (latency < 600) return 2; // Moyen
      if (latency < 1000) return 1; // Faible
      return 0; // Très faible
      
    } catch (error) {
      console.log('❌ Erreur mesure niveau physique 4G/5G:', error);
      return -1;
    }
  };

  // Fonction pour récupérer le niveau de signal mobile basé sur la performance réseau
  const getMobileSignalByPerformance = async () => {
    try {
      // Vérifier d'abord si on est sur Mobile
      const networkState = await Network.getNetworkStateAsync();
      if (networkState.type !== Network.NetworkStateType.CELLULAR) {
        console.log('📱 Pas sur Mobile, retour niveau 0');
        return 0;
      }

      // VOTRE RÈGLE : Si pas d'Internet = croix rouge (0)
      if (!networkState.isInternetReachable) {
        return 0; // Affiche ❌
      }

      // Mesurer la performance réseau réelle
      const latency = await measureLatency();
      console.log('📱 Latence mesurée:', latency, 'ms');
      
      // Convertir la latence en niveau 0-4 (4 niveaux + X)
      if (latency < 150) return 4; // Excellent
      if (latency < 300) return 3; // Bon
      if (latency < 600) return 2; // Moyen
      if (latency < 1000) return 1; // Faible
      return 0; // Très faible (X)

    } catch (error) {
      console.log('❌ Erreur générale getMobileSignalByPerformance:', error);
      return 0;
    }
  };

  // Fonction pour détecter le type et le niveau de réseau
  const detectNetworkState = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      console.log('🔍 État réseau détecté:', networkState);

      if (networkState.isConnected) {
        let wifiAvailable = false;
        let mobileAvailable = false;
        let wifiLevel = 0;
        let mobileLevel = 0;

        // Détecter WiFi avec niveau réel
        if (networkState.type === Network.NetworkStateType.WIFI) {
          wifiAvailable = true;
          
          // VOTRE RÈGLE : Si pas d'Internet = croix rouge (0)
          if (!networkState.isInternetReachable) {
            wifiLevel = 0; // Affiche ❌
          } else {
            // Si Internet OK, utiliser le niveau de signal WiFi réel
            try {
              wifiLevel = await getRealWifiSignal();
            } catch (error) {
              console.log('❌ Erreur getRealWifiSignal, utilisation niveau par défaut');
              wifiLevel = 4; // Niveau par défaut si erreur
            }
          }
        } else {
          // WiFi non disponible
          wifiAvailable = false;
          wifiLevel = 0;
        }

        // NOUVELLE LOGIQUE : Toujours mesurer le niveau physique 4G/5G
        const physicalMobileLevel = await getPhysicalMobileSignal();
        const mobileDataEnabled = await getMobileDataStatus();
        
        // Détecter Mobile (4G/5G) avec niveau basé sur la performance
        if (networkState.type === Network.NetworkStateType.CELLULAR) {
          mobileAvailable = true;
          
          // VOTRE RÈGLE : Si pas d'Internet = croix rouge (0)
          if (!networkState.isInternetReachable) {
            mobileLevel = 0; // Affiche ❌
          } else {
            // Si Internet OK, utiliser la performance réseau réelle
            try {
              mobileLevel = await getMobileSignalByPerformance();
            } catch (error) {
              console.log('❌ Erreur getMobileSignalByPerformance, utilisation niveau par défaut');
              mobileLevel = 4; // Niveau par défaut si erreur
            }
          }
        } else {
          // Mobile non utilisé actuellement mais peut être disponible physiquement
          mobileAvailable = false; // Pas utilisé pour la connexion
          mobileLevel = physicalMobileLevel; // Utiliser le niveau physique pour l'affichage
        }

        console.log('📶 WiFi:', wifiAvailable ? `Niveau ${wifiLevel}` : 'Non disponible');
        console.log('📱 Mobile:', mobileAvailable ? `Niveau ${mobileLevel}` : 'Non disponible');
        console.log('🔍 Type réseau détecté:', networkState.type);
        console.log('🔍 WiFi disponible:', wifiAvailable);
        console.log('🔍 Mobile disponible:', mobileAvailable);

        // RÈGLE ÉCRAN PHONE : Priorité 4G/5G
        if (mobileAvailable) {
          console.log('📱 4G/5G prioritaire pour l\'écran phone');
          setNetworkType('mobile');
          setNetworkLevel(mobileLevel);
        } else if (wifiAvailable) {
          console.log('📶 WiFi utilisé pour l\'écran phone (pas de 4G/5G)');
          setNetworkType('wifi');
          setNetworkLevel(wifiLevel);
        } else {
          console.log('❌ Aucun réseau disponible');
          setNetworkType('none');
          setNetworkLevel(0);
        }

        // Stocker les infos complètes pour le zoom
        const newNetworkInfo = {
          wifi: {
            available: wifiAvailable,
            level: wifiLevel,
            type: 'wifi' as const
          },
          mobile: {
            available: mobileAvailable,
            level: mobileLevel,
            type: 'mobile' as const
          },
          primary: (mobileAvailable ? 'mobile' : wifiAvailable ? 'wifi' : 'none') as 'wifi' | 'mobile' | 'none',
          mobileDataEnabled: mobileDataEnabled
        };

        setNetworkInfo(newNetworkInfo);
        console.log('🌐 Info réseaux complète:', newNetworkInfo);

      } else {
        console.log('❌ Pas de connexion réseau');
        setNetworkType('none');
        setNetworkLevel(0);
        setNetworkInfo({
          wifi: { available: false, level: 0, type: 'wifi' },
          mobile: { available: false, level: 0, type: 'mobile' },
          primary: 'none',
          mobileDataEnabled: false
        });
      }
    } catch (error) {
      console.log('❌ Erreur détection réseau:', error);
      setNetworkType('none');
      setNetworkLevel(0);
    }
  };

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
          <ContactList
            onContactSelect={handleContactSelect}
            onCreateContact={navigateToCreateContact}
            onHomePress={() => setCurrentScreen('navigation')}
          />
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
                networkLevel={networkType === 'wifi' ? networkInfo.wifi.level : networkLevel}
                wifiLevel={networkInfo.wifi.level} // Utilise le niveau WiFi réel calculé
                mobileLevel={networkInfo.mobile.level} // Utilise le niveau mobile réel calculé
                mobileDataEnabled={networkInfo.mobileDataEnabled} // Statut des données mobiles
                networkType={networkType} // Type de réseau utilisé
                networkInfo={networkInfo}
                batteryLevel={batteryLevel}
                onSpeakingChange={setIsSpeaking}
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
        <NavigationScreen
          onNavigateToContacts={navigateToContacts}
          onNavigateToPhone={navigateToPhone}
          onNavigateToCreateContact={navigateToCreateContact}
        />
      )}

      {/* Écran de création de contact */}
      {currentScreen === 'createContact' && (
        <CreateContactScreen
          onContactCreated={handleContactCreated}
          onCancel={() => setCurrentScreen('contacts')}
          onHomePress={() => setCurrentScreen('navigation')}
        />
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
