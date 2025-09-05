import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Modal,
} from 'react-native';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

/**
 * Interface des propriétés du composant SystemInfo
 * @interface SystemInfoProps
 * @property {number} [networkLevel] - Niveau de signal réseau (0-5, défaut: 4)
 * @property {number} [wifiLevel] - Niveau de signal WiFi (0-4, défaut: 4)
 * @property {number} [mobileLevel] - Niveau de signal mobile 4G/5G (0-4, défaut: 4)
 * @property {number} [batteryLevel] - Niveau de batterie (0-100, défaut: 85)
 * @property {string} [networkType] - Type de réseau ('wifi' | 'mobile' | 'none')
 * @property {object} [networkInfo] - Informations détaillées du réseau
 * @property {function} [onSpeakingChange] - Callback pour changement de synthèse vocale
 */
interface SystemInfoProps {
  networkLevel?: number;
  wifiLevel?: number;
  mobileLevel?: number;
  mobileDataEnabled?: boolean;
  batteryLevel?: number;
  networkType?: 'wifi' | 'mobile' | 'none';
  networkInfo?: any;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

/**
 * Composant SystemInfo - Affiche les informations système (réseau, batterie, heure)
 * avec des modals de zoom interactifs et synthèse vocale pour l'accessibilité seniors.
 *
 * @component
 * @param {SystemInfoProps} props - Propriétés du composant
 * @returns {JSX.Element} Composant SystemInfo rendu
 *
 * @example
 * ```tsx
 * <SystemInfo networkLevel={3} batteryLevel={75} />
 * ```
 *
 * @features
 * - Affichage en temps réel de l'heure
 * - Indicateurs visuels 3D pour réseau et batterie
 * - Modals de zoom avec informations détaillées
 * - Synthèse vocale pour l'accessibilité
 * - Optimisé avec React.memo, useCallback et useMemo
 */
export const SystemInfo: React.FC<SystemInfoProps> = React.memo(
  ({ 
    networkLevel = 4, 
    wifiLevel = 4, 
    mobileLevel = 4, 
    mobileDataEnabled = true,
    batteryLevel = 85,
    networkType, // eslint-disable-line @typescript-eslint/no-unused-vars
    networkInfo, // eslint-disable-line @typescript-eslint/no-unused-vars
    onSpeakingChange // eslint-disable-line @typescript-eslint/no-unused-vars
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

    // ===== FONCTIONS DE SYNTHÈSE VOCALE =====

    // Configuration de la voix pour les seniors (claire et douce)
    const speechConfig = useMemo(
      () => ({
        language: 'fr-FR',
        pitch: 1.0, // Voix naturelle
        rate: 0.8, // Vitesse lente pour les seniors
        volume: 1.0, // Volume maximum
        voice: 'com.apple.ttsbundle.Samantha-compact', // Voix claire sur iOS
      }),
      []
    );

    // Fonction pour lire l'heure
    const speakTime = useCallback(() => {
      const timeString = currentTime.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const message = `Il est ${timeString}`;

      // Lecture avec gestion d'erreur
      try {
        Speech.speak(message, speechConfig);
      } catch {
        // Gestion silencieuse des erreurs
      }
    }, [currentTime, speechConfig]);

    // Fonction pour lire les informations du réseau
    const speakNetwork = useCallback(() => {
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
        qualityText = 'même';
        descriptionText = 'signal moyen';
      } else {
        qualityText = 'faible';
        descriptionText = 'signal faible';
      }

      const message = `Réseau mobile. Niveau ${networkLevel} sur 5. Qualité ${qualityText}. ${descriptionText}`;

      // Lecture avec gestion d'erreur
      try {
        Speech.speak(message, speechConfig);
      } catch {
        // Gestion silencieuse des erreurs
      }
    }, [networkLevel, speechConfig]);

    // Fonction pour lire les informations de la batterie
    const speakBattery = useCallback(() => {
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
        levelText = 'faign';
        statusText = 'faign';
      } else {
        levelText = 'critique';
        statusText = 'critique';
      }

      const message = `Batterie à ${batteryLevel} pour cent. Niveau ${levelText}. État de charge ${statusText}`;

      // Lecture avec gestion d'erreur
      try {
        Speech.speak(message, speechConfig);
      } catch {
        // Gestion silencieuse des erreurs
      }
    }, [batteryLevel, speechConfig]);

    // Fonction pour arrêter la parole
    const stopSpeaking = useCallback(() => {
      Speech.stop();
    }, []);

    const handleTimePress = useCallback(() => {
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
    }, [zoomScale, zoomOpacity, speakTime]);

    const closeTimeZoom = useCallback(() => {
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
    }, [zoomScale, zoomOpacity, stopSpeaking]);

    const handleNetworkPress = useCallback(() => {
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

      // Lecture automatique des informations de réseau
      setTimeout(() => speakNetwork(), 350); // Délai pour laisser l'animation se terminer
    }, [networkZoomScale, networkZoomOpacity, speakNetwork]);

    const closeNetworkZoom = useCallback(() => {
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
    }, [networkZoomScale, networkZoomOpacity, stopSpeaking]);

    const handleBatteryPress = useCallback(() => {
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
    }, [batteryZoomScale, batteryZoomOpacity, speakBattery]);

    const closeBatteryZoom = useCallback(() => {
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
    }, [batteryZoomScale, batteryZoomOpacity, stopSpeaking]);

    /**
     * Détermine la couleur appropriée pour le niveau de batterie
     * @function getBatteryColor
     * @param {number} level - Niveau de batterie (0-100)
     * @returns {string} Code couleur hexadécimal
     *
     * @example
     * const color = getBatteryColor(75); // Retourne '#4CAF50'
     *
     * @colorMapping
     * - >50%: Vert (#4CAF50)
     * - 21-50%: Orange (#FF9800)
     * - 0-20%: Rouge (#F44336)
     */
    const getBatteryColor = useMemo(
      () => (level: number) => {
        if (level > 50) {
          return '#4CAF50';
        }
        if (level > 20) {
          return '#FF9800';
        }
        return '#F44336';
      },
      []
    );

    /**
     * Détermine la couleur appropriée pour le niveau de signal réseau
     * @function getNetworkColor
     * @param {number} level - Niveau de signal réseau (0-5)
     * @returns {string} Code couleur hexadécimal
     *
     * @example
     * const color = getNetworkColor(4); // Retourne '#4CAF50'
     *
     * @colorMapping
     * - >3: Vert (#4CAF50) - Signal fort
     * - 2-3: Orange (#FF9800) - Signal moyen
     * - 0-1: Rouge (#F44336) - Signal faible
     */
    const getNetworkColor = useMemo(
      () => (level: number) => {
        if (level > 3) {
          return '#4CAF50';
        }
        if (level > 1) {
          return '#FF9800';
        }
        return '#F44336';
      },
      []
    );

    // Fonction pour afficher le niveau de réseau avec effet 3D
    const renderNetworkLevel3D = useCallback(
      (level: number) => {
        // Si niveau 0, afficher croix rouge (même règle que zoom WiFi)
        if (level === 0) {
          return (
            <TouchableOpacity
              style={styles.network3DContainer}
              onPress={handleNetworkPress}
              activeOpacity={0.8}
            >
              <Text style={styles.noSignalText}>❌</Text>
            </TouchableOpacity>
          );
        }

        // Sinon, afficher les barres (4 barres comme le zoom WiFi)
        const maxBars = 4; // Même nombre de barres que le zoom WiFi
        const bars = [];

        for (let i = 0; i < maxBars; i++) {
          const isActive = i < level; // Même logique que le zoom WiFi
          const barHeight = 20 + (i + 1) * 8;
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
                },
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
            <View style={styles.signalBars3D}>{bars}</View>
          </TouchableOpacity>
        );
      },
      [getNetworkColor, handleNetworkPress]
    );

    // Fonction pour afficher le niveau de batterie avec effet 3D
    const renderBatteryLevel3D = useCallback(
      (level: number) => {
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
                  },
                ]}
              />
            </View>

            {/* Pourcentage en bas */}
            <Text style={[styles.battery3DText, { color: color }]}>
              {level}%
            </Text>
          </TouchableOpacity>
        );
      },
      [getBatteryColor, handleBatteryPress]
    );

    // Fonction pour afficher l'heure qui remplit tout le cadre
    const renderTime3D = useCallback(() => {
      return (
        <TouchableOpacity
          style={styles.time3DContainer}
          onPress={handleTimePress}
          activeOpacity={0.8}
        >
          <Text style={styles.time3DText}>
            {currentTime.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </TouchableOpacity>
      );
    }, [currentTime, handleTimePress]);

    return (
      <>
        <View testID='system-info-container' style={styles.container}>
          {/* Cadre Réseau - Couleur bleue avec modèle 3D étendu */}
          <View
            testID='network-section'
            style={[styles.infoFrame, styles.networkFrame]}
          >
            {renderNetworkLevel3D(networkLevel)}
          </View>

          {/* Cadre Heure - Couleur orange avec heure 3D */}
          <View
            testID='time-section'
            style={[styles.infoFrame, styles.timeFrame]}
          >
            {renderTime3D()}
          </View>

          {/* Cadre Batterie - Couleur verte avec modèle 3D */}
          <View
            testID='battery-section'
            style={[styles.infoFrame, styles.batteryFrame]}
          >
            {renderBatteryLevel3D(batteryLevel)}
          </View>
        </View>

        {/* Modal de zoom de l'heure */}
        <Modal
          visible={showTimeZoom}
          transparent={true}
          animationType='none'
          onRequestClose={closeTimeZoom}
        >
          <TouchableOpacity
            testID='time-zoom-modal'
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
                },
              ]}
            >
              <View style={styles.zoomTimeCard}>
                {/* Section Titre/Heure (20% de la hauteur) */}
                <View style={styles.zoomTimeTitleSection}>
                  <Text style={styles.zoomTimeIcon}>🕐</Text>
                  <Text style={styles.zoomTimeText}>
                    {currentTime.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </Text>
                </View>

                {/* Section Date complète (50% de la hauteur) */}
                <View style={styles.zoomTimeDateSection}>
                  <Text style={styles.zoomDateText}>
                    {currentTime.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>

                {/* Section Séparateur (10% de la hauteur) */}
                <View style={styles.zoomTimeSeparatorSection}>
                  <View style={styles.zoomDivider} />
                </View>

                {/* Section Bouton relire (15% de la hauteur) */}
                <View style={styles.zoomTimeButtonSection}>
                  <TouchableOpacity
                    style={styles.zoomVoiceButton}
                    onPress={speakTime}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={styles.zoomVoiceButtonText}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      🔊 Relire l'heure
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Section Instructions (15% de la hauteur) */}
                <View style={styles.zoomTimeCloseSection}>
                  <Text style={styles.zoomInfoText}>
                    Appuyez n'importe où pour fermer
                  </Text>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Modal>

        {/* Modal de zoom du réseau */}
        <Modal
          visible={showNetworkZoom}
          transparent={true}
          animationType='none'
          onRequestClose={closeNetworkZoom}
        >
          <TouchableOpacity
            testID='network-zoom-modal'
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
                },
              ]}
            >
              <View style={styles.zoomNetworkCard}>
                {/* Section 4G/5G (30% hauteur) - MAINTENANT EN PREMIER */}
                <View style={styles.zoomNetworkMobileSection}>
                  <Text style={styles.zoomNetworkSectionTitle}>📱 Réseaux</Text>
                  <View style={styles.zoomNetworkBarsContainer}>
                    {mobileLevel === -1 ? (
                      // 4G/5G non disponible physiquement
                      <View style={styles.disabledContainer}>
                        <Text style={styles.disabledSymbol}>🚫</Text>
                        <Text style={styles.disabledText}>Non disponible</Text>
                      </View>
                    ) : mobileLevel === 0 ? (
                      // 4G/5G disponible mais pas de signal
                      <Text style={styles.noSignalText}>❌</Text>
                    ) : (
                      // 4G/5G disponible avec niveau physique
                      <View style={styles.signalBars3D}>
                        {Array.from({ length: 4 }, (_, i) => {
                          const isActive = i < mobileLevel;
                          const barHeight = 20 + (i + 1) * 8;
                          const opacity = isActive ? 1 : 0.15;
                          const color = getNetworkColor(mobileLevel);

                          return (
                            <View
                              key={`mobile-${i}`}
                              style={[
                                styles.networkBar3D,
                                {
                                  height: barHeight,
                                  backgroundColor: color,
                                  opacity: opacity,
                                  transform: [{ scaleY: isActive ? 1 : 0.2 }],
                                },
                              ]}
                            />
                          );
                        })}
                      </View>
                    )}
                  </View>
                  <Text style={styles.zoomNetworkLevelText}>
                    {mobileLevel === -1
                      ? 'Non disponible'
                      : mobileLevel >= 4
                        ? 'Niveau 4/4 - Excellent'
                        : mobileLevel >= 3
                          ? 'Niveau 3/4 - Bon'
                          : mobileLevel >= 2
                            ? 'Niveau 2/4 - Moyen'
                            : mobileLevel >= 1
                              ? 'Niveau 1/4 - Faible'
                              : 'Non disponible'}
                  </Text>
                  <Text style={styles.zoomNetworkStatusText}>
                    {mobileLevel === -1
                      ? 'Données mobiles: Désactivées'
                      : mobileDataEnabled
                        ? 'Données mobiles: Activées'
                        : 'Données mobiles: Désactivées'}
                  </Text>
                  <Text style={styles.zoomNetworkUsedText}>
                    {networkType === 'wifi'
                      ? 'Réseau utilisé: WiFi'
                      : networkType === 'mobile'
                        ? 'Réseau utilisé: 4G/5G'
                        : 'Réseau utilisé: Aucun'}
                  </Text>
                </View>

                {/* Section vide (10% hauteur) */}
                <View style={styles.zoomNetworkEmptySection} />

                {/* Section WiFi (30% hauteur) - MAINTENANT EN SECOND */}
                <View style={styles.zoomNetworkWifiSection}>
                  <Text style={styles.zoomNetworkSectionTitle}>📶 WiFi</Text>
                  <View style={styles.zoomNetworkBarsContainer}>
                    {wifiLevel === 0 ? (
                      <Text style={styles.noSignalText}>❌</Text>
                    ) : (
                      <View style={styles.signalBars3D}>
                        {Array.from({ length: 4 }, (_, i) => {
                          const isActive = i < wifiLevel;
                          const barHeight = 20 + (i + 1) * 8;
                          const opacity = isActive ? 1 : 0.15;
                          const color = getNetworkColor(wifiLevel);

                          return (
                            <View
                              key={`wifi-${i}`}
                              style={[
                                styles.networkBar3D,
                                {
                                  height: barHeight,
                                  backgroundColor: color,
                                  opacity: opacity,
                                  transform: [{ scaleY: isActive ? 1 : 0.2 }],
                                },
                              ]}
                            />
                          );
                        })}
                      </View>
                    )}
                  </View>
                  <Text style={styles.zoomNetworkLevelText}>
                    {wifiLevel >= 4
                      ? 'Niveau 4/4 - Excellent'
                      : wifiLevel >= 3
                        ? 'Niveau 3/4 - Bon'
                        : wifiLevel >= 2
                          ? 'Niveau 2/4 - Moyen'
                          : wifiLevel >= 1
                            ? 'Niveau 1/4 - Faible'
                            : 'Non disponible'}
                  </Text>
                </View>

                {/* Section Bouton Relire (20% hauteur) */}
                <View style={styles.zoomNetworkButtonSection}>
                  <TouchableOpacity
                    style={styles.zoomVoiceButton}
                    onPress={speakNetwork}
                    
                    activeOpacity={0.8}
                  >
                    <Text
                      style={styles.zoomVoiceButtonText}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      🔊 Relire le réseau
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Section Instructions (20% hauteur) */}
                <View style={styles.zoomNetworkCloseSection}>
                  <Text style={styles.zoomInfoText}>
                    Appuyez n'importe où pour fermer
                  </Text>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Modal>

        {/* Modal de zoom de la batterie */}
        <Modal
          visible={showBatteryZoom}
          transparent={true}
          animationType='none'
          onRequestClose={closeBatteryZoom}
        >
          <TouchableOpacity
            testID='battery-zoom-modal'
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
                },
              ]}
            >
              <View style={styles.zoomBatteryCard}>
                {/* Icône batterie - 15% de la hauteur */}
                <View style={styles.zoomBatteryIconSection}>
                  <Text style={styles.zoomBatteryTitle}>🔋</Text>
                </View>

                {/* Niveau batterie texte - 15% de la hauteur */}
                <View style={styles.zoomBatteryTextSection}>
                  <Text
                    style={[
                      styles.zoomBatteryStatus,
                      { color: getBatteryColor(batteryLevel) },
                    ]}
                  >
                    {batteryLevel >= 80
                      ? 'Chargée'
                      : batteryLevel >= 60
                        ? 'Bonne'
                        : batteryLevel >= 40
                          ? 'Moyenne'
                          : batteryLevel >= 20
                            ? 'Faible'
                            : 'Critique'}
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
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.zoomBatteryPercentage,
                      { color: getBatteryColor(batteryLevel) },
                    ]}
                  >
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
                    <Text
                      style={styles.zoomVoiceButtonText}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
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
  }
);

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
    elevation: 5, // Augmenté pour éviter d'être caché
    zIndex: 1, // Ajouté pour s'assurer que l'élément reste visible
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
  zoomTimeTitleSection: {
    height: '40%', // 40% de la hauteur du cadre zoom (au lieu de 20%)
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Marge entre les sections
  },
  zoomTimeIcon: {
    fontSize: Math.min(50, Math.max(35, width * 0.12)), // +20% : 40→50, 30→35, 0.1→0.12
    marginBottom: 10, // Marge entre l'icône et le texte
  },
  zoomTimeText: {
    fontSize: Math.min(86, Math.max(58, width * 0.144)), // +20% : 72→86, 48→58, 0.12→0.144
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  zoomTimeDateSection: {
    height: '30%', // 30% de la hauteur du cadre zoom (au lieu de 50%)
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Marge entre les sections
  },
  zoomDateText: {
    fontSize: Math.min(34, Math.max(24, width * 0.084)), // +20% : 28→34, 20→24, 0.07→0.084
    color: '#666',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  zoomTimeSeparatorSection: {
    height: '10%', // 10% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Marge entre les sections
  },
  zoomTimeButtonSection: {
    height: '15%', // 15% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Marge entre les sections
  },
  zoomTimeCloseSection: {
    height: '15%', // 15% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  zoomBatteryValue: {
    fontSize: Math.min(24, Math.max(18, width * 0.06)), // Taille optimisée
    color: '#333',
    fontWeight: 'bold',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  zoomBatteryStatus: {
    fontSize: Math.min(38, Math.max(29, width * 0.096)), // +20% : 32→38, 24→29, 0.08→0.096
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
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
    elevation: 6, // Augmenté pour éviter d'être caché
    zIndex: 1, // Ajouté pour s'assurer que l'élément reste visible
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
  },
  // Styles pour le modal de zoom du réseau
  zoomNetworkCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    padding: Math.min(50, Math.max(35, width * 0.12)), // Padding réduit : 35 à 50
    alignItems: 'center',   
    justifyContent: 'center', 
    // flexDirection: 'row' supprimé pour revenir à la disposition verticale
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
  zoomNetworkWifiSection: {
    height: '30%', // 30% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 0, // Pas d'espacement
  },
  zoomNetworkEmptySection: {  // Section vide (10% hauteur)
    height: '10%',   // 10% de la hauteur du cadre zoom 
    width: '100%',  // 100% de la largeur du cadre zoom     
  },
  zoomNetworkMobileSection: {
    height: '30%', // 30% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 0, // Marge entre les sections
  },
  zoomNetworkBarsContainer: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    //marginBottom: 0,
    //marginTop: 0,
  },
  zoomNetworkSectionTitle: {
    fontSize: Math.min(40, Math.max(28, width * 0.108)),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    height: '30%',
    width: '100%',
   // marginBottom: 0,
    //marginTop: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  zoomNetworkLevelText: {
    height: '20%',
    width: '100%',
    fontSize: Math.min(24, Math.max(18, width * 0.06)),
    color: '#666',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
   
  },
  noSignalText: {
    fontSize: Math.min(50, Math.max(35, width * 0.12)),
    color: '#F44336',
    textAlign: 'center',
    marginTop: 10,
  },
  disabledContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  disabledSymbol: {
    fontSize: Math.min(40, Math.max(30, width * 0.1)),
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 5,
  },
  disabledText: {
    fontSize: Math.min(16, Math.max(12, width * 0.04)),
    color: '#9E9E9E',
    textAlign: 'center',
    fontWeight: '500',
  },
  disabledSymbolRed: {
    fontSize: Math.min(40, Math.max(30, width * 0.1)),
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 5,
  },
  disabledTextRed: {
    fontSize: Math.min(16, Math.max(12, width * 0.04)),
    color: '#F44336',
    textAlign: 'center',
    fontWeight: '500',
  },
  zoomNetworkStatusText: {
    fontSize: Math.min(14, Math.max(10, width * 0.035)),
    color: '#B0BEC5',
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 6,
    fontStyle: 'italic',
  },
  zoomNetworkUsedText: {
    fontSize: Math.min(14, Math.max(10, width * 0.035)),
    color: '#90A4AE',
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 8,
    fontStyle: 'italic',
  },
  zoomNetworkBar3D: {
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
  zoomNetworkButtonSection: {
    height: '20%', // 20% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
    //marginBottom: 20, // Marge entre les sections
  },
  zoomNetworkCloseSection: {
    height: '20%', // 20% de la hauteur du cadre zoom
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});
