import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  Vibration,
  Alert,
  PermissionsAndroid,
  Platform
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { CallScreen } from './CallScreen';

const { width, height } = Dimensions.get('window');

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  photo?: string;
  isFavorite: boolean;
}

interface ContactListProps {
  onContactSelect: (contact: Contact) => void;
  onCreateContact: () => void;
  onHomePress: () => void;
}

export const ContactList: React.FC<ContactListProps> = ({ 
  onContactSelect, 
  onCreateContact, 
  onHomePress 
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showCallScreen, setShowCallScreen] = useState(false);

  useEffect(() => {
    requestContactsPermission();
  }, []);

  const requestContactsPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Permission d\'accès aux contacts',
            message: 'Cette application a besoin d\'accéder à vos contacts pour afficher la liste.',
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setError('Permission refusée pour accéder aux contacts');
          setLoading(false);
          return;
        }
      }

      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission refusée pour accéder aux contacts');
        setLoading(false);
        return;
      }

      await loadContacts();
    } catch (err) {
      setError('Erreur lors de la demande de permission');
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      
      // Récupérer tous les contacts avec des noms, numéros de téléphone et photos
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.ID,
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Image, // Ajouter le champ Image pour récupérer les photos
        ],
        // Supprimer la limitation pour récupérer tous les contacts
        // pageSize: 100,
        // pageOffset: 0,
      });

      if (data.length > 0) {
        // Transformer les contacts en format utilisable - plus efficace
        const formattedContacts: Contact[] = data
          .filter(contact => {
            // Filtrage plus strict et rapide
            return contact.name && 
                   contact.phoneNumbers && 
                   contact.phoneNumbers.length > 0 &&
                   contact.phoneNumbers[0]?.number;
          })
          .map(contact => ({
            id: contact.id || `contact_${Date.now()}_${Math.random()}`,
            name: contact.name || 'Sans nom',
            phoneNumber: contact.phoneNumbers![0].number!,
            photo: contact.image?.uri || undefined, // Récupérer l'URI de la photo si elle existe
            isFavorite: false,
          }))
          .sort((a, b) => a.name.localeCompare(b.name, 'fr'));

        console.log(`Contacts chargés: ${formattedContacts.length} sur ${data.length} total`);
        console.log(`Contacts avec photos: ${formattedContacts.filter(c => c.photo).length}`);
        setContacts(formattedContacts);
      } else {
        setError('Aucun contact trouvé');
      }
    } catch (err) {
      console.error('Erreur chargement contacts:', err);
      setError('Erreur lors du chargement des contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleContactPress = (contact: Contact) => {
    Vibration.vibrate(50);
    setSelectedContact(contact);
    setShowCallScreen(true);
  };

  const handleCallPress = (contact: Contact) => {
    Vibration.vibrate(100);
    Alert.alert(
      'Appel',
      `Appeler ${contact.name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Appeler', 
          onPress: () => {
            // Ici vous pouvez ajouter la logique d'appel réelle
            Alert.alert('Appel', `Connexion en cours vers ${contact.name}...`);
          }
        }
      ]
    );
  };

  const handleCall = (contact: Contact) => {
    Vibration.vibrate(200);
    // Ici vous pouvez ajouter la logique d'appel réelle
    Alert.alert('Appel', `Connexion en cours vers ${contact.name}...`);
    // Retour à la liste des contacts après l'appel
    setShowCallScreen(false);
    setSelectedContact(null);
  };

  const handleBackToList = () => {
    setShowCallScreen(false);
    setSelectedContact(null);
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactPress(item)}
      activeOpacity={0.7}
    >
      {/* Photo de profil */}
      <View style={styles.photoContainer}>
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.contactPhoto} />
        ) : (
          <View style={styles.defaultPhoto}>
            <Text style={styles.defaultPhotoText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {item.isFavorite && (
          <View style={styles.favoriteBadge}>
            <Text style={styles.favoriteText}>⭐</Text>
          </View>
        )}
      </View>

      {/* Informations du contact */}
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
      </View>

      {/* Bouton d'appel */}
      <TouchableOpacity
        style={styles.callButton}
        onPress={() => handleCallPress(item)}
        activeOpacity={0.6}
      >
        <Text style={styles.callButtonText}>📞</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Si l'écran d'appel est affiché
  if (showCallScreen && selectedContact) {
    return (
      <CallScreen
        contact={selectedContact}
        onHomePress={onHomePress}
        onCall={handleCall}
        onCancel={handleBackToList}
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        {/* Bouton Accueil */}
        <View style={styles.homeSection}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={onHomePress}
            activeOpacity={0.7}
          >
            <Text style={styles.homeButtonText}>🏠 Accueil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>📱 Contacts</Text>
          <Text style={styles.headerSubtitle}>Chargement en cours...</Text>
        </View>
        
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>⏳ Chargement des contacts...</Text>
          <Text style={styles.loadingSubtext}>Cela peut prendre quelques secondes</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📱 Contacts</Text>
          <Text style={styles.headerSubtitle}>Erreur</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadContacts}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bouton Accueil */}
      <View style={styles.homeSection}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={onHomePress}
          activeOpacity={0.7}
        >
          <Text style={styles.homeButtonText}>🏠 Accueil</Text>
        </TouchableOpacity>
      </View>

      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📱 Contacts</Text>
        <Text style={styles.headerSubtitle}>
          {contacts.length} contact{contacts.length > 1 ? 's' : ''} chargé{contacts.length > 1 ? 's' : ''}
        </Text>
        
        {/* Bouton de création */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={onCreateContact}
          activeOpacity={0.7}
        >
          <Text style={styles.createButtonText}>➕ Nouveau</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des contacts */}
      <FlatList
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        // Optimisations pour de grandes listes
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 80, // Hauteur approximative de chaque item
          offset: 80 * index,
          index,
        })}
        // Indicateur de chargement en bas
        ListFooterComponent={loading ? (
          <View style={styles.loadingFooter}>
            <Text style={styles.loadingFooterText}>Chargement...</Text>
          </View>
        ) : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  homeSection: {
    height: height * 0.1,
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
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  header: {
    backgroundColor: '#FFC107', // Jaune principal - même couleur que phoneSection
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 4,
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
    opacity: 0.9,
  },
  listContainer: {
    padding: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 1.0)',
    borderLeftColor: 'rgba(255, 255, 255, 1.0)',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  photoContainer: {
    position: 'relative',
    marginRight: 15,
  },
  contactPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFC107',
  },
  defaultPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFA000',
  },
  defaultPhotoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  favoriteBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFA000',
  },
  favoriteText: {
    fontSize: 12,
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 16,
    color: '#666666',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    // Effet 3D avec bordures contrastées
    borderTopColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  callButtonText: {
    fontSize: 20,
  },
  separator: {
    height: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  createButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingFooter: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  loadingFooterText: {
    fontSize: 16,
    color: '#666',
  },
});
