import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Vibration,
  Alert
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  photo?: string;
  isFavorite: boolean;
}

interface CallScreenProps {
  contact: Contact;
  onHomePress: () => void;
  onCall: (contact: Contact) => void;
  onCancel: () => void;
}

export const CallScreen: React.FC<CallScreenProps> = ({ 
  contact, 
  onHomePress, 
  onCall, 
  onCancel 
}) => {
  const handleCall = () => {
    Vibration.vibrate(100);
    Alert.alert(
      'Appel',
      `Appeler ${contact.name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Appeler', 
          onPress: () => {
            Vibration.vibrate(200);
            onCall(contact);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* Partie 1: Accueil - 10% de la hauteur */}
      <View style={[styles.section, styles.homeSection]}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={onHomePress}
          activeOpacity={0.7}
        >
          <Text style={styles.homeButtonText}>🏠 Accueil</Text>
        </TouchableOpacity>
      </View>

      {/* Partie 2: Nom et prénom du contact - 60% de la hauteur */}
      <View style={[styles.section, styles.contactSection]}>
        {/* Photo du contact */}
        <View style={styles.photoContainer}>
          {contact.photo ? (
            <View style={styles.contactPhotoWrapper}>
              <Text style={styles.photoLabel}>Photo du contact</Text>
              <View style={styles.contactPhotoContainer}>
                <Text style={styles.contactPhotoText}>📷</Text>
              </View>
            </View>
          ) : (
            <View style={styles.defaultPhotoWrapper}>
              <Text style={styles.photoLabel}>Initiale</Text>
              <View style={styles.defaultPhotoContainer}>
                <Text style={styles.defaultPhotoText}>
                  {contact.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Informations du contact */}
        <View style={styles.contactInfo}>
          {/* Nom et prénom */}
          <View style={styles.nameContainer}>
            <Text style={styles.contactName}>{contact.name}</Text>
          </View>
          
          {/* Numéro de téléphone */}
          <View style={styles.phoneContainer}>
            <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
          </View>
        </View>
      </View>

      {/* Partie 3: Boutons Appeler et Annuler - 30% de la hauteur */}
      <View style={[styles.section, styles.callSection]}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <Text style={styles.callButtonText}>Appeler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  section: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  homeSection: {
    height: height * 0.1, // 10% de la hauteur
    backgroundColor: '#4CAF50', // Vert principal - même couleur que phone
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
  contactSection: {
    height: height * 0.6, // 60% de la hauteur
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    justifyContent: 'space-around',
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
  callSection: {
    height: height * 0.3, // 30% de la hauteur
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
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
  homeButton: {
    width: '95%',
    height: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
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
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photoLabel: {
    fontSize: Math.max(18, height * 0.022),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  contactPhotoWrapper: {
    alignItems: 'center',
  },
  contactPhotoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#1976D2',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  contactPhotoText: {
    fontSize: 48,
    color: '#FFFFFF',
  },
  defaultPhotoWrapper: {
    alignItems: 'center',
  },
  defaultPhotoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFA000',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  defaultPhotoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contactInfo: {
    alignItems: 'center',
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  contactName: {
    fontSize: Math.max(28, height * 0.035),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  phoneContainer: {
    alignItems: 'center',
  },
  contactPhone: {
    fontSize: Math.max(22, height * 0.028),
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  callButton: {
    backgroundColor: '#4CAF50', // Vert pour le bouton appeler
    borderColor: '#388E3C',
  },
  callButtonText: {
    fontSize: Math.max(24, height * 0.03),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  actionButton: {
    width: '45%',
    height: '80%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  cancelButton: {
    backgroundColor: '#F44336', // Rouge pour le bouton annuler
    borderColor: '#D32F2F',
  },
  cancelButtonText: {
    fontSize: Math.max(24, height * 0.03),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
});
