import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView,
  Alert,
  Vibration,
  Animated
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SystemInfo } from './components/SystemInfo';
import { PhoneDisplay } from './components/PhoneDisplay';
import { DialPad } from './components/DialPad';

const { height } = Dimensions.get('window');

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [networkLevel, setNetworkLevel] = useState(4);
  const [batteryLevel, setBatteryLevel] = useState(85);
  
  // Animation pour l'effet de clic
  const callButtonScale = useRef(new Animated.Value(1)).current;
  const homeButtonScale = useRef(new Animated.Value(1)).current;

  const addNumber = (num: string) => {
    if (phoneNumber.length < 15) { // Limite à 15 chiffres
      setPhoneNumber(prev => prev + num);
      // Vibration tactile pour feedback
      Vibration.vibrate(50);
    }
  };

  const clearNumber = () => {
    setPhoneNumber('');
    Vibration.vibrate(100);
  };

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

    Alert.alert('Accueil', 'Retour à l\'écran d\'accueil');
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

      Alert.alert(
        'Appel en cours',
        `Appeler le numéro ${phoneNumber} ?`,
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'Appeler',
            onPress: () => {
              console.log('Appel en cours vers:', phoneNumber);
              // Ici vous pouvez ajouter la logique d'appel réelle
              Alert.alert('Appel', 'Connexion en cours...');
            },
          },
        ]
      );
    }
  };

  // Simulation des changements de niveau réseau et batterie
  useEffect(() => {
    const networkTimer = setInterval(() => {
      setNetworkLevel(prev => {
        const newLevel = prev + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(1, Math.min(4, newLevel));
      });
    }, 10000);

    const batteryTimer = setInterval(() => {
      setBatteryLevel(prev => {
        const newLevel = prev + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(0, Math.min(100, newLevel));
      });
    }, 30000);

    return () => {
      clearInterval(networkTimer);
      clearInterval(batteryTimer);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Partie 1: Bouton Accueil (10% de la hauteur) */}
      <View style={[styles.section, styles.homeSection]}>
        <TouchableOpacity 
          style={styles.homeButton}
          activeOpacity={0.8}
          onPress={handleHomePress}
        >
          <Animated.View style={{ transform: [{ scale: homeButtonScale }] }}>
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
          onClear={clearNumber}
        />
      </View>

      {/* Partie 4: Pavé numérique (55% de la hauteur) */}
      <View style={[styles.section, styles.dialPadSection]}>
        <DialPad onNumberPress={addNumber} />
      </View>

      {/* Partie 5: Bouton Appeler (10% de la hauteur) */}
      <View style={[styles.section, styles.callSection]}>
        <TouchableOpacity 
          style={[
            styles.callButton, 
            { opacity: phoneNumber.length > 0 ? 1 : 0.5 }
          ]} 
          onPress={makeCall}
          disabled={phoneNumber.length === 0}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ scale: callButtonScale }] }}>
            <Text style={styles.callButtonText}>📞 Appeler</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Blanc cassé - moins agressif pour les yeux seniors
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
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // Effet 3D ultra renforcé avec bordures contrastées
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
  infoSection: {
    height: height * 0.15,
    backgroundColor: '#4CAF50', // Vert principal - meilleure perception
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // Effet 3D ultra renforcé avec bordures contrastées
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
  phoneSection: {
    height: height * 0.1,
    backgroundColor: '#FFC107', // Jaune principal - très visible même avec presbytie
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFA000',
  },
  dialPadSection: {
    height: height * 0.55,
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
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // Effet 3D ultra renforcé avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // Effet 3D ultra renforcé avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  callButtonText: {
    color: '#FFFFFF', // Blanc pur pour contraste optimal
    fontSize: 22, // Plus grand pour s'adapter au bouton agrandi
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)', // Ombre plus prononcée
    textShadowOffset: { width: 2, height: 2 }, // Ombre plus décalée
    textShadowRadius: 3, // Ombre plus étendue
  },
});
