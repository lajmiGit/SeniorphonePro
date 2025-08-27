import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Dimensions,
  Vibration,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { VirtualKeyboard } from './VirtualKeyboard';

const { width, height } = Dimensions.get('window');

interface CreateContactScreenProps {
  onContactCreated: () => void;
  onCancel: () => void;
  onHomePress: () => void;
}

export const CreateContactScreen: React.FC<CreateContactScreenProps> = ({ 
  onContactCreated, 
  onCancel,
  onHomePress
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeField, setActiveField] = useState<'firstName' | 'lastName' | 'phoneNumber' | null>(null);

  const handleSave = async () => {
    if (!firstName.trim() && !lastName.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir au moins un prénom ou un nom');
      Vibration.vibrate(100);
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un numéro de téléphone');
      Vibration.vibrate(100);
      return;
    }

    try {
      setIsCreating(true);
      Vibration.vibrate(50);

      // Créer le contact
      const newContact = {
        contactType: Contacts.ContactTypes.Person,
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumbers: [
          {
            number: phoneNumber.trim(),
            label: 'mobile'
          }
        ],
        image: photoUri ? { uri: photoUri } : undefined
      };

      await Contacts.addContactAsync(newContact);
      
      Vibration.vibrate(200);
      Alert.alert(
        'Succès', 
        'Contact créé avec succès !',
        [
          {
            text: 'OK',
            onPress: onContactCreated
          }
        ]
      );
    } catch (error) {
      Vibration.vibrate(300);
      Alert.alert('Erreur', 'Impossible de créer le contact. Vérifiez les permissions.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleTakePhoto = () => {
    Vibration.vibrate(50);
    Alert.alert(
      'Photo',
      'Fonctionnalité photo à implémenter',
      [
        { text: 'OK' }
      ]
    );
    // Ici vous pourrez ajouter la logique pour prendre une photo
    // setPhotoUri('uri_de_la_photo');
  };

  const handleKeyboardKeyPress = (key: string) => {
    if (activeField === 'firstName') {
      setFirstName(prev => prev + key);
    } else if (activeField === 'lastName') {
      setLastName(prev => prev + key);
    } else if (activeField === 'phoneNumber') {
      setPhoneNumber(prev => prev + key);
    }
  };

  const handleKeyboardBackspace = () => {
    if (activeField === 'firstName') {
      setFirstName(prev => prev.slice(0, -1));
    } else if (activeField === 'lastName') {
      setLastName(prev => prev.slice(0, -1));
    } else if (activeField === 'phoneNumber') {
      setPhoneNumber(prev => prev.slice(0, -1));
    }
  };

  const handleKeyboardValidate = () => {
    setShowKeyboard(false);
    setActiveField(null);
  };

  const handleKeyboardClose = () => {
    setShowKeyboard(false);
    setActiveField(null);
  };

  const openKeyboard = (field: 'firstName' | 'lastName' | 'phoneNumber') => {
    setActiveField(field);
    setShowKeyboard(true);
  };

  const handleCancel = () => {
    Vibration.vibrate(100);
    onCancel();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {showKeyboard ? (
        <VirtualKeyboard
          onKeyPress={handleKeyboardKeyPress}
          onBackspace={handleKeyboardBackspace}
          onValidate={handleKeyboardValidate}
          onClose={handleKeyboardClose}
          currentText={
            activeField === 'firstName' ? firstName : 
            activeField === 'lastName' ? lastName : 
            activeField === 'phoneNumber' ? phoneNumber : ''
          }
        />
      ) : (
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

          {/* Partie 2: Nouveau Contact - 15% de la hauteur */}
          <View style={[styles.section, styles.headerSection]}>
            <Text style={styles.headerTitle}>➕ Nouveau Contact</Text>
            <Text style={styles.headerSubtitle}>Créez un nouveau contact</Text>
          </View>

          {/* Partie 3: Formulaire de saisie - 50% de la hauteur */}
          <View style={[styles.section, styles.formSection]}>
            {/* Prénom */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Prénom</Text>
              <TouchableOpacity
                style={styles.textInput}
                onPress={() => openKeyboard('firstName')}
                activeOpacity={0.7}
              >
                <Text style={[styles.inputText, !firstName && styles.placeholderText]}>
                  {firstName || 'Appuyez pour saisir'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Nom */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom</Text>
              <TouchableOpacity
                style={styles.textInput}
                onPress={() => openKeyboard('lastName')}
                activeOpacity={0.7}
              >
                <Text style={[styles.inputText, !lastName && styles.placeholderText]}>
                  {lastName || 'Appuyez pour saisir'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Numéro de téléphone */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Numéro de téléphone *</Text>
              <TouchableOpacity
                style={styles.textInput}
                onPress={() => openKeyboard('phoneNumber')}
                activeOpacity={0.7}
              >
                <Text style={[styles.inputText, !phoneNumber && styles.placeholderText]}>
                  {phoneNumber || 'Appuyez pour saisir'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Partie 4: Photo - 15% de la hauteur */}
          <View style={[styles.section, styles.photoSection]}>
            <Text style={styles.photoLabel}>Photo (optionnel)</Text>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={handleTakePhoto}
              activeOpacity={0.7}
            >
              {photoUri ? (
                <View style={styles.photoPreview}>
                  <Text style={styles.photoPreviewText}>✅ Photo ajoutée</Text>
                </View>
              ) : (
                <Text style={styles.photoButtonText}>📸 Ajouter une photo</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Partie 5: Boutons d'action - 15% de la hauteur */}
          <View style={[styles.section, styles.buttonSection]}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText} numberOfLines={1}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton, 
                  styles.saveButton,
                  (!firstName.trim() && !lastName.trim()) || !phoneNumber.trim() ? styles.disabledButton : {}
                ]}
                onPress={handleSave}
                activeOpacity={0.7}
                disabled={(!firstName.trim() && !lastName.trim()) || !phoneNumber.trim() || isCreating}
              >
                <Text style={[
                  styles.saveButtonText,
                  ((!firstName.trim() && !lastName.trim()) || !phoneNumber.trim() || isCreating) ? styles.disabledButtonText : {}
                ]} numberOfLines={1}>
                  {isCreating ? 'Création...' : 'Sauvegarder'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mainContainer: {
    flex: 1,
    padding: 10,
  },
  section: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  homeSection: {
    height: height * 0.1, // 10% de la hauteur
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // Effet 3D avec bordures contrastées
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
  headerSection: {
    height: height * 0.1, // 10% de la hauteur (au lieu de 15%)
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFA000',
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
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
  formSection: {
    height: height * 0.5, // 50% de la hauteur
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20, // Réduit de 30 à 20 pour plus d'espace
    justifyContent: 'space-evenly', // Changé de space-around à space-evenly
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
  inputGroup: {
    marginBottom: 0, // Supprimé pour utiliser space-evenly
    alignItems: 'center',
    flex: 1, // Chaque groupe prend une part égale de l'espace
    justifyContent: 'center',
    minHeight: 0, // Permet la compression
  },
  inputLabel: {
    fontSize: Math.max(18, height * 0.022), // Réduit pour s'adapter
    fontWeight: 'bold',
    color: '#333',
    marginBottom: Math.max(8, height * 0.01), // Réduit et responsive
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 3,
    borderColor: '#4CAF50',
    borderRadius: 16, // Réduit de 18 à 16
    paddingVertical: Math.max(12, height * 0.015), // Responsive et adapté
    paddingHorizontal: Math.max(20, height * 0.025), // Responsive et adapté
    minHeight: Math.max(45, height * 0.055), // Responsive et adapté
    maxHeight: Math.max(60, height * 0.07), // Limite maximale
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6, // Réduit de 8 à 6
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3, // Réduit de 4 à 3
    },
    shadowOpacity: 0.3, // Réduit de 0.4 à 0.3
    shadowRadius: 5, // Réduit de 6 à 5
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderRightColor: 'rgba(76, 175, 80, 0.6)',
    borderBottomColor: 'rgba(76, 175, 80, 0.6)',
  },
  inputText: {
    fontSize: Math.max(18, height * 0.022), // Réduit pour s'adapter
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  placeholderText: {
    color: '#999',
    fontStyle: 'italic',
  },
  photoSection: {
    height: height * 0.15, // 15% de la hauteur
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
  photoLabel: {
    fontSize: Math.max(16, height * 0.02), // Responsive
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  photoButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    paddingVertical: Math.max(12, height * 0.015), // Responsive
    paddingHorizontal: Math.max(20, height * 0.025), // Responsive
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#CCCCCC',
    // Effet 3D avec bordures contrastées
    borderTopColor: '#F5F5F5',
    borderLeftColor: '#F5F5F5',
    borderRightColor: '#CCCCCC',
    borderBottomColor: '#CCCCCC',
  },
  photoButtonText: {
    fontSize: Math.max(16, height * 0.02), // Responsive
    color: '#333333',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  photoPreview: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: Math.max(8, height * 0.01), // Responsive
    paddingHorizontal: Math.max(15, height * 0.02), // Responsive
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#388E3C',
    // Effet 3D avec bordures contrastées
    borderTopColor: '#388E3C',
    borderLeftColor: '#388E3C',
    borderRightColor: '#388E3C',
    borderBottomColor: '#388E3C',
  },
  photoPreviewText: {
    color: '#FFFFFF',
    fontSize: Math.max(14, height * 0.018), // Responsive
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Math.max(15, width * 0.04), // Responsive
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 3,
    borderRadius: 18,
    paddingVertical: Math.max(15, height * 0.018), // Responsive et adapté
    paddingHorizontal: Math.max(20, height * 0.025), // Responsive et adapté
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    height: height * 0.12, // 80% de la partie 5 (15% * 0.8 = 12% de l'écran)
    minHeight: Math.max(50, height * 0.06), // Hauteur minimale garantie
    maxHeight: Math.max(70, height * 0.08), // Hauteur maximale pour éviter le débordement
  },
  cancelButton: {
    backgroundColor: '#F44336', // Background rouge
    borderColor: '#D32F2F',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50', // Background vert
    borderColor: '#388E3C',
    marginLeft: 10,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: 'rgba(200, 200, 200, 0.9)',
  },
  cancelButtonText: {
    fontSize: Math.max(18, height * 0.022), // Taille adaptée pour une ligne
    fontWeight: 'bold',
    color: '#FFFFFF', // Texte blanc sur fond rouge
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false, // Évite le padding automatique
    textAlignVertical: 'center', // Centrage vertical parfait
  },
  saveButtonText: {
    fontSize: Math.max(18, height * 0.022), // Taille adaptée pour une ligne
    fontWeight: 'bold',
    color: '#FFFFFF', // Texte blanc sur fond vert
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false, // Évite le padding automatique
    textAlignVertical: 'center', // Centrage vertical parfait
  },
  disabledButtonText: {
    fontSize: Math.max(18, height * 0.022), // Taille adaptée pour une ligne
    fontWeight: 'bold',
    color: '#000000', // Texte noir quand désactivé
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    includeFontPadding: false, // Évite le padding automatique
    textAlignVertical: 'center', // Centrage vertical parfait
  },
  buttonSection: {
    height: height * 0.15, // 15% de la hauteur (au lieu de 20%)
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
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 255, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  headerTitle: {
    fontSize: 24, // Plus compact
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 14, // Plus compact
    color: '#FFFFFF',
    marginTop: 5,
    opacity: 0.9,
  },
});
