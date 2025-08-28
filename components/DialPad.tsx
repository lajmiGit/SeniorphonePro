import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';


const { height } = Dimensions.get('window');

interface DialPadProps {
  onNumberPress: (num: string) => void;
}

export const DialPad: React.FC<DialPadProps> = ({ onNumberPress }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);



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
          uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
        },
        {
          shouldPlay: false,
          volume: 0.7, // Volume adapté aux seniors
          rate: 1.0, // Vitesse normale
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
    ['*', '0', '#'],
  ];

  // Calcul de la taille de police adaptative
  const getAdaptiveFontSize = () => {
    const buttonSize = height * 0.12 - 20; // Taille du bouton moins les marges
    return Math.max(24, Math.min(buttonSize * 0.6, 48)); // Entre 24px et 48px
  };

  return (
    <View style={styles.container}>
      {dialPadNumbers.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map(num => (
            <TouchableOpacity
              key={num}
              style={styles.button}
              onPress={() => handleNumberPress(num)}
              activeOpacity={0.5}
              pressRetentionOffset={{
                top: 20,
                left: 20,
                right: 20,
                bottom: 20,
              }}
            >
              <Text
                style={[styles.buttonText, { fontSize: getAdaptiveFontSize() }]}
              >
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
    aspectRatio: 1,
    borderWidth: 2,
    // Effet 3D avec petite élévation + ombres et bordures contrastées
    elevation: 2, // Élévation très subtile pour Android
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    // Effet 3D subtil avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 0.8)', // Bordure supérieure plus claire
    borderLeftColor: 'rgba(255, 255, 255, 0.8)', // Bordure gauche plus claire
    borderRightColor: 'rgba(255, 255, 255, 0.4)', // Bordure droite plus sombre
    borderBottomColor: 'rgba(255, 255, 255, 0.4)', // Bordure inférieure plus sombre
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
