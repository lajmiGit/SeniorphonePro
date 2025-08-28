import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

const { height } = Dimensions.get('window');

interface DialPadProps {
  onNumberPress: (num: string) => void;
}

export const DialPad: React.FC<DialPadProps> = ({ onNumberPress }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Configuration de la voix pour les seniors (claire et douce)
  const speechConfig = {
    language: 'fr-FR',
    pitch: 1.0,        // Voix naturelle
    rate: 0.7,         // Vitesse lente pour les seniors
    volume: 0.8,       // Volume confortable
    voice: 'com.apple.ttsbundle.Samantha-compact', // Voix claire sur iOS
  };

  // Initialisation du son au chargement du composant
  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Chargement du son de touche
  const loadSound = async () => {
    try {
      // Création d'un son synthétique simple et fiable
      const { sound: newSound } = await Audio.Sound.createAsync(
        { 
          uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT' 
        },
        { 
          shouldPlay: false,
          volume: 0.7, // Volume adapté aux seniors
          rate: 1.0    // Vitesse normale
        }
      );
      setSound(newSound);
      console.log('🎵 Son de touche chargé avec succès');
    } catch (error) {
      console.log('❌ Erreur lors du chargement du son:', error);
    }
  };

  // Jouer le son de touche
  const playTouchSound = async () => {
    try {
      if (sound) {
        console.log('🔊 Lecture du son de touche');
        await sound.replayAsync();
      } else {
        console.log('⚠️ Son non disponible');
      }
    } catch (error) {
      console.log('❌ Erreur lors de la lecture du son:', error);
    }
  };

  // Lire le chiffre/symbole en français
  const speakNumber = (num: string) => {
    try {
      let textToSpeak = '';
      
      // Conversion des chiffres et symboles en français
      switch (num) {
        case '0': textToSpeak = 'Zéro'; break;
        case '1': textToSpeak = 'Un'; break;
        case '2': textToSpeak = 'Deux'; break;
        case '3': textToSpeak = 'Trois'; break;
        case '4': textToSpeak = 'Quatre'; break;
        case '5': textToSpeak = 'Cinq'; break;
        case '6': textToSpeak = 'Six'; break;
        case '7': textToSpeak = 'Sept'; break;
        case '8': textToSpeak = 'Huit'; break;
        case '9': textToSpeak = 'Neuf'; break;
        case '*': textToSpeak = 'Étoile'; break;
        case '#': textToSpeak = 'Dièse'; break;
        default: textToSpeak = num; break;
      }
      
      console.log('🗣️ Lecture vocale:', textToSpeak);
      Speech.speak(textToSpeak, speechConfig);
    } catch (error) {
      console.log('❌ Erreur lors de la lecture vocale:', error);
    }
  };

  // Gestion de la pression sur une touche avec son et lecture vocale
  const handleNumberPress = async (num: string) => {
    // Jouer le son de touche
    await playTouchSound();
    
    // Appeler la fonction de callback
    onNumberPress(num);
  };

  const dialPadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  // Calcul de la taille de police adaptative
  const getAdaptiveFontSize = () => {
    const buttonSize = (height * 0.12) - 20; // Taille du bouton moins les marges
    return Math.max(24, Math.min(buttonSize * 0.6, 48)); // Entre 24px et 48px
  };

  return (
    <View style={styles.container}>
      {dialPadNumbers.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.button}
              onPress={() => handleNumberPress(num)}
              activeOpacity={0.5}
              pressRetentionOffset={{ top: 20, left: 20, right: 20, bottom: 20 }}
            >
              <Text style={[styles.buttonText, { fontSize: getAdaptiveFontSize() }]}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: height * 0.12,
  },
  button: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    aspectRatio: 1,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    // Effet 3D avec bordure interne
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: 'white',
    fontSize: 0, // Taille automatique qui s'adapte au bouton
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
