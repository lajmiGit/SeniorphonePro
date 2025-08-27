import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface SystemInfoProps {
  networkLevel?: number;
  batteryLevel?: number;
}

export const SystemInfo: React.FC<SystemInfoProps> = ({ 
  networkLevel = 4, 
  batteryLevel = 85 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      <View style={styles.network3DContainer}>
        {/* Barres de signal 3D seulement */}
        <View style={styles.signalBars3D}>
          {bars}
        </View>
      </View>
    );
  };

  // Fonction pour afficher le niveau de batterie avec effet 3D
  const renderBatteryLevel3D = (level: number) => {
    const color = getBatteryColor(level);
    
    return (
      <View style={styles.battery3DContainer}>
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
      </View>
    );
  };

  // Fonction pour afficher l'heure qui remplit tout le cadre
  const renderTime3D = () => {
    return (
      <View style={styles.time3DContainer}>
        <Text style={styles.time3DText}>
          {currentTime.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    );
  };

  return (
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
    backgroundColor: '#2196F3', // Bleu principal - bon contraste avec les barres vertes
    borderWidth: 2,
    borderColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  batteryFrame: {
    backgroundColor: '#FFC107', // Jaune principal - très visible même avec presbytie
    borderWidth: 2,
    borderColor: '#FFA000',
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
    borderColor: 'white',
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
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
