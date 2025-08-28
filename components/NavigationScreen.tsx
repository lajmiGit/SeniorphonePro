import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Vibration,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface NavigationScreenProps {
  onNavigateToContacts: () => void;
  onNavigateToPhone: () => void;
  onNavigateToCreateContact: () => void;
}

export const NavigationScreen: React.FC<NavigationScreenProps> = ({
  onNavigateToContacts,
  onNavigateToPhone,
  onNavigateToCreateContact,
}) => {
  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📱 SeniorPhonePro</Text>
        <Text style={styles.headerSubtitle}>Choisissez votre fonction</Text>
      </View>

      {/* Bouton Contacts */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={onNavigateToContacts}
        activeOpacity={0.7}
      >
        <View style={styles.buttonIcon}>
          <Text style={styles.iconText}>📱</Text>
        </View>
        <Text style={styles.buttonTitle}>Contacts</Text>
        <Text style={styles.buttonSubtitle}>Gérer vos contacts</Text>
      </TouchableOpacity>

      {/* Bouton Création de Contact */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={onNavigateToCreateContact}
        activeOpacity={0.7}
      >
        <View style={styles.buttonIcon}>
          <Text style={styles.iconText}>➕</Text>
        </View>
        <Text style={styles.buttonTitle}>Nouveau Contact</Text>
        <Text style={styles.buttonSubtitle}>Créer un contact</Text>
      </TouchableOpacity>

      {/* Bouton Téléphone */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={onNavigateToPhone}
        activeOpacity={0.7}
      >
        <View style={styles.buttonIcon}>
          <Text style={styles.iconText}>📞</Text>
        </View>
        <Text style={styles.buttonTitle}>Téléphone</Text>
        <Text style={styles.buttonSubtitle}>Composer un numéro</Text>
      </TouchableOpacity>

      {/* Informations supplémentaires */}
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          Application optimisée pour les seniors
        </Text>
        <Text style={styles.infoText}>Interface 3D et couleurs adaptées</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    backgroundColor: '#4CAF50', // Vert principal - même couleur que homeSection
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 10,
    opacity: 0.9,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 25,
    borderRadius: 20,
    marginBottom: 25,
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
  buttonIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFC107', // Jaune principal
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FFA000',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  iconText: {
    fontSize: 40,
  },
  buttonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  buttonSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  infoSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 5,
  },
});
