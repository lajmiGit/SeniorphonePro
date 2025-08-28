import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, Modal } from 'react-native';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

// Log des dimensions pour vérification
console.log('=== DIMENSIONS ÉCRAN ===');
console.log('Largeur écran:', width, 'px');
console.log('Hauteur écran:', height, 'px');
console.log('Largeur zoom (90%):', Math.round(width * 0.9), 'px');
console.log('Hauteur zoom (80%):', Math.round(height * 0.8), 'px');
console.log('========================');

interface SystemInfoProps {
  networkLevel?: number;
  batteryLevel?: number;
}

export const SystemInfo: React.FC<SystemInfoProps> = ({ 
  networkLevel = 4, 
  batteryLevel = 85 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimeZoom, setShowTimeZoom] = useState(false);
  const [showNetworkZoom, setShowNetworkZoom] = useState(false);
  const [showBatteryZoom, setShowBatteryZoom] = useState(false);

  const zoomScale = useRef(new Animated.Value(0)).current;
  const zoomOpacity = useRef(new Animated.Value(0)).current;
  const networkZoomScale = useRef(new Animated.Value(0)).current;
  const networkZoomOpacity = useRef(new Animated.Value(0)).current;
  const batteryZoomScale = useRef(new Animated.Value(0)).current;
  const batteryZoomOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimePress = () => {
    setShowTimeZoom(true);
    // Animation d'entrée avec zoom et fade
    Animated.parallel([
      Animated.timing(zoomScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(zoomOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Lecture automatique de l'heure
    setTimeout(() => speakTime(), 350); // Délai pour laisser l'animation se terminer
  };

  const closeTimeZoom = () => {
    // Arrêter la parole
    stopSpeaking();
    
    // Animation de sortie
    Animated.parallel([
      Animated.timing(zoomScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(zoomOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowTimeZoom(false);
    });
  };

  const handleNetworkPress = () => {
    setShowNetworkZoom(true);
    // Animation d'entrée avec zoom et fade
    Animated.parallel([
      Animated.timing(networkZoomScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(networkZoomOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Lecture automatique des informations réseau
    setTimeout(() => speakNetwork(), 350); // Délai pour laisser l'animation se terminer
  };

  const closeNetworkZoom = () => {
    // Arrêter la parole
    stopSpeaking();
    
    // Animation de sortie
    Animated.parallel([
      Animated.timing(networkZoomScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(networkZoomOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowNetworkZoom(false);
    });
  };

  const handleBatteryPress = () => {
    setShowBatteryZoom(true);
    // Animation d'entrée avec zoom et fade
    Animated.parallel([
      Animated.timing(batteryZoomScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(batteryZoomOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Lecture automatique des informations de batterie
    setTimeout(() => speakBattery(), 350); // Délai pour laisser l'animation se terminer
  };

  const closeBatteryZoom = () => {
    // Arrêter la parole
    stopSpeaking();
    
    // Animation de sortie
    Animated.parallel([
      Animated.timing(batteryZoomScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(batteryZoomOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowBatteryZoom(false);
    });
  };



  const getBatteryColor = (level: number) => {
    if (level > 50) return '#4CAF50';
    if (level > 20) return '#FF9800';
    return '#F44336';
  };

  const getNetworkColor = (level: number) => {
    if (level > 3) return '#4CAF50';
    if (level > 1) return '#FF9800';
    return '#F44336';
  };

  // Fonction pour afficher le niveau de réseau avec effet 3D
  const renderNetworkLevel3D = (level: number) => {
    const maxBars = 5;
    const bars = [];
    
    for (let i = 1; i <= maxBars; i++) {
      const isActive = i <= level;
      const barHeight = 20 + (i * 8); // Hauteur encore plus grande pour remplir le cadre
      const opacity = isActive ? 1 : 0.15;
      const color = getNetworkColor(level);
      
      bars.push(
        <View 
          key={i} 
          style={[
            styles.networkBar3D, 
            { 
              height: barHeight,
              backgroundColor: color,
              opacity: opacity,
              transform: [{ scaleY: isActive ? 1 : 0.2 }],
            }
          ]} 
        />
      );
    }
    
    return (
      <TouchableOpacity 
        style={styles.network3DContainer} 
        onPress={handleNetworkPress}
        activeOpacity={0.8}
      >
        {/* Barres de signal 3D seulement */}
        <View style={styles.signalBars3D}>
          {bars}
        </View>
      </TouchableOpacity>
    );
  };

  // Fonction pour afficher le niveau de batterie avec effet 3D
  const renderBatteryLevel3D = (level: number) => {
    const color = getBatteryColor(level);
    
    return (
      <TouchableOpacity 
        style={styles.battery3DContainer} 
        onPress={handleBatteryPress}
        activeOpacity={0.8}
      >
        {/* Batterie 3D */}
        <View style={styles.battery3DOutline}>
          <View 
            style={[
              styles.battery3DLevel, 
              { 
                height: `${level}%`,
                backgroundColor: color,
              }
            ]} 
          />
        </View>
        
        {/* Pourcentage en bas */}
        <Text style={[styles.battery3DText, { color: color }]}>
          {level}%
        </Text>
      </TouchableOpacity>
    );
  };

  // Fonction pour afficher l'heure qui remplit tout le cadre
  const renderTime3D = () => {
    return (
      <TouchableOpacity 
        style={styles.time3DContainer} 
        onPress={handleTimePress}
        activeOpacity={0.8}
      >
        <Text style={styles.time3DText}>
          {currentTime.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </TouchableOpacity>
    );
  };

  // ===== FONCTIONS DE SYNTHÈSE VOCALE =====
  
  // Configuration de la voix pour les seniors (claire et douce)
  const speechConfig = {
    language: 'fr-FR',
    pitch: 1.0,        // Voix naturelle
    rate: 0.8,         // Vitesse lente pour les seniors
    volume: 1.0,       // Volume maximum
    voice: 'com.apple.ttsbundle.Samantha-compact', // Voix claire sur iOS
  };

  // Fonction pour lire l'heure
  const speakTime = () => {
    console.log('⏰ Fonction speakTime appelée');
    console.log('⏰ Heure actuelle:', currentTime);
    
    const timeString = currentTime.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const message = `Il est ${timeString}`;
    
    console.log('⏰ Message généré:', message);
    console.log('⏰ Configuration voix:', speechConfig);
    
    // Lecture avec gestion d'erreur
    try {
      Speech.speak(message, speechConfig);
      console.log('⏰ Synthèse vocale lancée avec succès');
    } catch (error) {
      console.error('⏰ Erreur lors de la synthèse vocale:', error);
    }
  };

  // Fonction pour lire les informations du réseau
  const speakNetwork = () => {
    console.log(' Fonction speakNetwork appelée');
    console.log(' Niveau de réseau reçu:', networkLevel);
    
    // Détermination de la qualité avec plus de détails
    let qualityText = '';
    let descriptionText = '';
    
    if (networkLevel >= 4) {
      qualityText = 'excellente';
      descriptionText = 'signal très fort';
    } else if (networkLevel >= 3) {
      qualityText = 'bonne';
      descriptionText = 'signal fort';
    } else if (networkLevel >= 2) {
      qualityText = 'moyenne';
      descriptionText = 'signal moyen';
    } else {
      qualityText = 'faible';
      descriptionText = 'signal faible';
    }
    
    const message = `Réseau mobile. Niveau ${networkLevel} sur 5. Qualité ${qualityText}. ${descriptionText}`;
    
    console.log(' Message généré:', message);
    console.log(' Configuration voix:', speechConfig);
    
    // Lecture avec gestion d'erreur
    try {
      Speech.speak(message, speechConfig);
      console.log(' Synthèse vocale lancée avec succès');
    } catch (error) {
      console.error(' Erreur lors de la synthèse vocale:', error);
    }
  };

  // Fonction pour lire les informations de la batterie
  const speakBattery = () => {
    console.log('🔋 Fonction speakBattery appelée');
    console.log('🔋 Niveau de batterie reçu:', batteryLevel);
    
    // Détermination du niveau avec plus de détails
    let levelText = '';
    let statusText = '';
    
    if (batteryLevel >= 80) {
      levelText = 'excellent';
      statusText = 'excellent';
    } else if (batteryLevel >= 60) {
      levelText = 'bon';
      statusText = 'bon';
    } else if (batteryLevel >= 40) {
      levelText = 'moyen';
      statusText = 'moyen';
    } else if (batteryLevel >= 20) {
      levelText = 'faible';
      statusText = 'faible';
    } else {
      levelText = 'critique';
      statusText = 'critique';
    }
    
    const message = `Batterie à ${batteryLevel} pour cent. Niveau ${levelText}. État de charge ${statusText}`;
    
    console.log('🔋 Message généré:', message);
    console.log('🔋 Configuration voix:', speechConfig);
    
    // Lecture avec gestion d'erreur
    try {
      Speech.speak(message, speechConfig);
      console.log('🔋 Synthèse vocale lancée avec succès');
    } catch (error) {
      console.error('🔋 Erreur lors de la synthèse vocale:', error);
    }
  };

  // Fonction pour arrêter la parole
  const stopSpeaking = () => {
    Speech.stop();
  };

  return (
    <>
      <View style={styles.container}>
        {/* Cadre Réseau - Couleur bleue avec modèle 3D étendu */}
        <View style={[styles.infoFrame, styles.networkFrame]}>
          {renderNetworkLevel3D(networkLevel)}
        </View>
        
        {/* Cadre Heure - Couleur orange avec heure 3D */}
        <View style={[styles.infoFrame, styles.timeFrame]}>
          {renderTime3D()}
        </View>
        
        {/* Cadre Batterie - Couleur verte avec modèle 3D */}
        <View style={[styles.infoFrame, styles.batteryFrame]}>
          {renderBatteryLevel3D(batteryLevel)}
        </View>
      </View>

      {/* Modal de zoom de l'heure */}
      <Modal
        visible={showTimeZoom}
        transparent={true}
        animationType="none"
        onRequestClose={closeTimeZoom}
      >
        <TouchableOpacity 
          style={styles.zoomOverlay} 
          activeOpacity={1} 
          onPress={closeTimeZoom}
        >
          <Animated.View 
            style={[
              styles.zoomContainer,
              {
                transform: [{ scale: zoomScale }],
                opacity: zoomOpacity,
              }
            ]}
          >
            <View style={styles.zoomTimeCard}>
              <Text style={styles.zoomTimeText}>
                {currentTime.toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </Text>
              <Text style={styles.zoomDateText}>
                {currentTime.toLocaleDateString('fr-FR', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
              <View style={styles.zoomDivider} />
              
              {/* Bouton de lecture vocale */}
              <TouchableOpacity 
                style={styles.zoomVoiceButton}
                onPress={speakTime}
                activeOpacity={0.8}
              >
                <Text style={styles.zoomVoiceButtonText}>
                  🔊 Relire l'heure
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.zoomInfoText}>
                Appuyez n'importe où pour fermer
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de zoom du réseau */}
      <Modal
        visible={showNetworkZoom}
        transparent={true}
        animationType="none"
        onRequestClose={closeNetworkZoom}
      >
        <TouchableOpacity 
          style={styles.zoomOverlay} 
          activeOpacity={1} 
          onPress={closeNetworkZoom}
        >
          <Animated.View 
            style={[
              styles.zoomContainer,
              {
                transform: [{ scale: networkZoomScale }],
                opacity: networkZoomOpacity,
              }
            ]}
          >
            <View style={styles.zoomNetworkCard}>
              <Text style={styles.zoomNetworkTitle}>
                📶
              </Text>
              
              {/* Barres de réseau 3D parfaitement centrées */}
              <View style={styles.zoomNetworkVisual}>
                <View style={styles.zoomNetworkBars}>
                  {Array.from({ length: 5 }, (_, i) => {
                    const isActive = i < networkLevel;
                    const barHeight = 20 + ((i + 1) * 8); // Même logique que dans l'écran phone
                    const opacity = isActive ? 1 : 0.15;
                    const color = getNetworkColor(networkLevel);
                    
                    return (
                      <View 
                        key={i} 
                        style={[
                          styles.zoomNetworkBar3D, 
                          { 
                            height: barHeight,
                            backgroundColor: color,
                            opacity: opacity,
                            transform: [{ scaleY: isActive ? 1 : 0.2 }],
                          }
                        ]} 
                      />
                    );
                  })}
                </View>
              </View>
              
              {/* Qualité du réseau parfaitement centrée */}
              <View style={styles.zoomNetworkQuality}>
                <Text style={[styles.zoomNetworkQualityText, { color: getNetworkColor(networkLevel) }]}>
                  {networkLevel >= 4 ? 'Excellent' : 
                   networkLevel >= 3 ? 'Bon' : 
                   networkLevel >= 2 ? 'Moyen' : 'Faible'}
                </Text>
              </View>
              
              <View style={styles.zoomDivider} />
              
              {/* Bouton de lecture vocale */}
              <TouchableOpacity 
                style={styles.zoomVoiceButton}
                onPress={speakNetwork}
                activeOpacity={0.8}
              >
                <Text style={styles.zoomVoiceButtonText}>
                  🔊 Relire le réseau
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.zoomInfoText}>
                Appuyez n'importe où pour fermer
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de zoom de la batterie */}
      <Modal
        visible={showBatteryZoom}
        transparent={true}
        animationType="none"
        onRequestClose={closeBatteryZoom}
      >
        <TouchableOpacity 
          style={styles.zoomOverlay} 
          activeOpacity={1} 
          onPress={closeBatteryZoom}
        >
          <Animated.View 
            style={[
              styles.zoomContainer,
              {
                transform: [{ scale: batteryZoomScale }],
                opacity: batteryZoomOpacity,
              }
            ]}
          >
            <View style={styles.zoomBatteryCard}>
              {/* Icône batterie - 15% de la hauteur */}
              <View style={styles.zoomBatteryIconSection}>
                <Text style={styles.zoomBatteryTitle}>
                  🔋
                </Text>
              </View>
              
              {/* Niveau batterie texte - 15% de la hauteur */}
              <View style={styles.zoomBatteryTextSection}>
                <Text style={[styles.zoomBatteryStatus, { color: getBatteryColor(batteryLevel) }]}>
                  {batteryLevel >= 80 ? 'Chargée' : 
                   batteryLevel >= 60 ? 'Bonne' : 
                   batteryLevel >= 40 ? 'Moyenne' : 
                   batteryLevel >= 20 ? 'Faible' : 'Critique'}
                </Text>
              </View>
              
              {/* Image batterie 3D - 40% de la hauteur */}
              <View style={styles.zoomBatteryVisualSection}>
                <View style={styles.zoomBatteryOutline}>
                  <View 
                    style={[
                      styles.zoomBatteryLevel, 
                      { 
                        height: `${batteryLevel}%`,
                        backgroundColor: getBatteryColor(batteryLevel),
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.zoomBatteryPercentage, { color: getBatteryColor(batteryLevel) }]}>
                  {batteryLevel}%
                </Text>
              </View>
              
              {/* Bouton relire - 10% de la hauteur */}
              <View style={styles.zoomBatteryButtonSection}>
                <TouchableOpacity 
                  style={styles.zoomVoiceButton}
                  onPress={speakBattery}
                  activeOpacity={0.8}
                >
                  <Text style={styles.zoomVoiceButtonText}>
                    🔊 Relire la batterie
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Appuyer pour fermer - 10% de la hauteur */}
              <View style={styles.zoomBatteryCloseSection}>
                <Text style={styles.zoomInfoText}>
                  Appuyez n'importe où pour fermer
                </Text>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: '100%',
    paddingHorizontal: 5,
  },
  infoFrame: {
    flex: 1,
    marginHorizontal: 3,
    borderRadius: 15,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkFrame: {
    backgroundColor: '#F5F5F5', // Gris clair - comme la batterie
    borderWidth: 2,
    borderColor: '#000000', // Bordure noire
    justifyContent: 'center',
    alignItems: 'center',
  },
  batteryFrame: {
    backgroundColor: '#F5F5F5', // Gris clair - fond clair pour la batterie
    borderWidth: 2,
    borderColor: '#000000', // Bordure noire
  },
  timeFrame: {
    backgroundColor: '#FF9800', // Orange principal - bon compromis visibilité/fatigue
    borderWidth: 2,
    borderColor: '#F57C00',
  },
  infoItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  // Styles pour l'affichage 3D du réseau étendu
  network3DContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  signalBars3D: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    gap: 6,
  },
  networkBar3D: {
    width: 12,
    backgroundColor: 'white',
    borderRadius: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  // Styles existants pour la batterie
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 24,
    justifyContent: 'center',
  },
  signalBar: {
    width: 5,
    backgroundColor: 'white',
    marginHorizontal: 1,
    borderRadius: 2,
  },
  batteryContainer: {
    alignItems: 'center',
  },
  batteryOutline: {
    width: 30,
    height: 16,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  batteryLevel: {
    height: '100%',
    borderRadius: 1,
  },
  batteryText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Styles pour l'affichage 3D de la batterie
  battery3DContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  battery3DOutline: {
    width: 40,
    height: 60,
    borderWidth: 3,
    borderColor: '#000000', // Bordure noire
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  battery3DLevel: {
    width: '100%',
    borderRadius: 3,
    position: 'absolute',
    bottom: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  battery3DText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Styles pour l'affichage 3D de l'heure
  time3DContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  time3DText: {
    color: 'white',
    fontSize: Math.min(32, Math.max(14, width * 0.06)), // Taille réduite pour éviter le retour à la ligne
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false, // Évite le padding automatique
    textAlignVertical: 'center', // Centrage vertical parfait
    numberOfLines: 1, // Force l'affichage sur une seule ligne
    ellipsizeMode: 'tail', // Ajoute "..." si le texte est trop long
  },
  // Styles pour le modal de zoom de l'heure
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
  zoomTimeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    padding: Math.min(50, Math.max(35, width * 0.12)), // Padding réduit : 35 à 50
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
  zoomTimeText: {
    fontSize: Math.min(86, Math.max(58, width * 0.144)), // +20% : 72→86, 48→58, 0.12→0.144
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    includeFontPadding: false,
    textAlignVertical: 'center',
    numberOfLines: 1, // Force l'affichage sur une seule ligne
    ellipsizeMode: 'tail', // Ajoute "..." si le texte est trop long
  },
  zoomDateText: {
    fontSize: Math.min(34, Math.max(24, width * 0.084)), // +20% : 28→34, 20→24, 0.07→0.084
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    includeFontPadding: false,
    textAlignVertical: 'center',
    numberOfLines: 2, // Permet 2 lignes pour la date complète
    ellipsizeMode: 'tail', // Ajoute "..." si le texte est trop long
  },
  zoomDivider: {
    width: '80%',
    height: 2,
    backgroundColor: '#FF9800',
    borderRadius: 1,
    marginBottom: 20,
  },
  zoomInfoText: {
    fontSize: Math.min(18, Math.max(14, width * 0.045)),
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  // Styles pour le modal de zoom du réseau
  zoomNetworkCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    padding: Math.min(30, Math.max(20, width * 0.06)), // Padding réduit pour contenir le contenu
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
    // Dimensions exactes comme la batterie
    width: width * 0.9, // 90% de la largeur de l'écran
    height: height * 0.8, // 80% de la hauteur de l'écran
    // Centrage parfait
    alignSelf: 'center',
    // Assure que le contenu reste dans les limites
    overflow: 'hidden',
  },
  zoomNetworkTitle: {
    fontSize: Math.min(58, Math.max(38, width * 0.144)), // +20% : 48→58, 32→38, 0.12→0.144
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 25, // Marge augmentée
    includeFontPadding: false,
    textAlignVertical: 'center',
    numberOfLines: 1, // Force l'affichage sur une seule ligne
    ellipsizeMode: 'tail', // Ajoute "..." si le texte est trop long
  },
  zoomNetworkInfo: {
    width: '100%',
    marginBottom: 25, // Marge augmentée
  },
  zoomNetworkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Aligne les éléments sur le bas pour les barres
    marginBottom: 20, // Marge augmentée
    paddingHorizontal: 15, // Padding horizontal augmenté
  },
  zoomNetworkLabel: {
    fontSize: Math.min(38, Math.max(29, width * 0.096)), // +20% : 32→38, 24→29, 0.08→0.096
    color: '#666',
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
    numberOfLines: 1, // Force l'affichage sur une seule ligne
    ellipsizeMode: 'tail', // Ajoute "..." si le texte est trop long
  },
  zoomNetworkValue: {
    fontSize: Math.min(38, Math.max(29, width * 0.096)), // +20% : 32→38, 24→29, 0.08→0.096
    color: '#333',
    fontWeight: 'bold',
    includeFontPadding: false,
    textAlignVertical: 'center',
    numberOfLines: 1, // Force l'affichage sur une seule ligne
    ellipsizeMode: 'tail', // Ajoute "..." si le texte est trop long
  },
  zoomNetworkBars: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Aligne les barres sur le bas
    gap: 4,
    justifyContent: 'center', // Centre parfaitement le groupe de barres
  },
  zoomNetworkBar: {
    width: Math.min(16, Math.max(12, width * 0.035)), // Largeur augmentée au maximum
    borderRadius: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    marginHorizontal: 3, // Espacement augmenté entre les barres
  },
  zoomNetworkBar3D: {
    width: Math.min(20, Math.max(16, width * 0.04)), // Largeur plus grande pour le zoom
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    marginHorizontal: 4, // Espacement plus grand entre les barres
    alignSelf: 'center', // Centre chaque barre individuellement
  },
  zoomNetworkVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25, // Marge pour séparer des autres éléments
  },
  zoomNetworkQuality: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  zoomNetworkQualityText: {
    fontSize: Math.min(38, Math.max(29, width * 0.096)), // +20% : 32→38, 24→29, 0.08→0.096
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    numberOfLines: 1, // Force l'affichage sur une seule ligne
    ellipsizeMode: 'tail', // Ajoute "..." si le texte est trop long
  },
  // Styles pour le modal de zoom de la batterie
  zoomBatteryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    padding: Math.min(30, Math.max(20, width * 0.06)), // Padding réduit pour contenir le contenu
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
    // Dimensions exactes demandées
    width: width * 0.9, // 90% de la largeur de l'écran
    height: height * 0.8, // 80% de la hauteur de l'écran
    // Centrage parfait
    alignSelf: 'center',
    // Assure que le contenu reste dans les limites
    overflow: 'hidden',
  },
  zoomBatteryTitle: {
    fontSize: Math.min(43, Math.max(29, width * 0.108)), // +20% : 36→43, 24→29, 0.09→0.108
    fontWeight: 'bold',
    color: '#FF9800',
    textAlign: 'center',
    marginBottom: 20, // Marge optimisée
    includeFontPadding: false,
    textAlignVertical: 'center',
    numberOfLines: 1, // Force l'affichage sur une seule ligne
    ellipsizeMode: 'tail', // Ajoute "..." si le texte est trop long
  },
  // Sections du zoom batterie avec pourcentages exacts
  zoomBatteryIconSection: {
    height: '15%', // 15% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomBatteryTextSection: {
    height: '15%', // 15% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomBatteryVisualSection: {
    height: '40%', // 40% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomBatteryButtonSection: {
    height: '10%', // 10% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomBatteryCloseSection: {
    height: '10%', // 10% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomBatteryInfo: {
    width: '100%',
    marginBottom: 20, // Marge optimisée
  },
  zoomBatteryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12, // Marge réduite
    paddingHorizontal: 8, // Padding réduit
  },
  zoomBatteryLabel: {
    fontSize: Math.min(24, Math.max(18, width * 0.06)), // Taille optimisée
    color: '#666',
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
    numberOfLines: 1, // Force l'affichage sur une seule ligne
    ellipsizeMode: 'tail', // Ajoute "..." si le texte est trop long
  },
  zoomBatteryValue: {
    fontSize: Math.min(24, Math.max(18, width * 0.06)), // Taille optimisée
    color: '#333',
    fontWeight: 'bold',
    includeFontPadding: false,
    textAlignVertical: 'center',
    numberOfLines: 1, // Force l'affichage sur une seule ligne
    ellipsizeMode: 'tail', // Ajoute "..." si le texte est trop long
  },
  zoomBatteryStatus: {
    fontSize: Math.min(38, Math.max(29, width * 0.096)), // +20% : 32→38, 24→29, 0.08→0.096
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    numberOfLines: 1, // Force l'affichage sur une seule ligne
    ellipsizeMode: 'tail', // Ajoute "..." si le texte est trop long
  },
  zoomBatteryVisual: {
    alignItems: 'center',
    marginBottom: 25, // Marge augmentée pour centrer
  },
  zoomBatteryOutline: {
    width: Math.min(144, Math.max(120, width * 0.3)), // +20% : 120→144, 100→120, 0.25→0.3
    height: Math.min(216, Math.max(180, width * 0.48)), // +20% : 180→216, 150→180, 0.4→0.48
    borderWidth: 4,
    borderColor: '#000000', // Contour noir - version antérieure
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15, // Marge réduite pour la section
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  zoomBatteryLevel: {
    width: '100%',
    borderRadius: 8,
    position: 'absolute',
    bottom: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  zoomBatteryPercentage: {
    fontSize: Math.min(86, Math.max(58, width * 0.18)), // +20% : 72→86, 48→58, 0.15→0.18
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    numberOfLines: 1, // Force l'affichage sur une seule ligne
    ellipsizeMode: 'tail', // Ajoute "..." si le texte est trop long
  },
  // Styles pour les boutons de lecture vocale
  zoomVoiceButton: {
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
  zoomVoiceButtonText: {
    color: 'white',
    fontSize: Math.min(22, Math.max(17, width * 0.054)), // +20% : 18→22, 14→17, 0.045→0.054
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    numberOfLines: 1,
    ellipsizeMode: 'tail',
  },
});
