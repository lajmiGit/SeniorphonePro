import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '../types';

// Clés de cache
const CACHE_KEYS = {
  CONTACTS: 'contacts_cache',
  LAST_UPDATE: 'contacts_last_update',
  CACHE_DURATION: 'contacts_cache_duration',
} as const;

// Configuration du cache
const CACHE_CONFIG = {
  DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_CONTACTS: 1000, // Limite de contacts en cache
} as const;

// Interface pour les données en cache
interface CacheData<T> {
  data: T;
  timestamp: number;
  version: string;
}

// Version du cache pour invalidation
const CACHE_VERSION = '1.0.0';

/**
 * Service de gestion du cache pour les contacts
 * Optimise les performances en évitant les rechargements fréquents
 */
export class CacheService {
  /**
   * Sauvegarde les contacts dans le cache
   * @param contacts - Liste des contacts à sauvegarder
   */
  static async saveContacts(contacts: Contact[]): Promise<void> {
    try {
      const cacheData: CacheData<Contact[]> = {
        data: contacts.slice(0, CACHE_CONFIG.MAX_CONTACTS), // Limite le nombre de contacts
        timestamp: Date.now(),
        version: CACHE_VERSION,
      };

      await AsyncStorage.setItem(CACHE_KEYS.CONTACTS, JSON.stringify(cacheData));
      await AsyncStorage.setItem(CACHE_KEYS.LAST_UPDATE, Date.now().toString());
      
      console.log('💾 Cache contacts sauvegardé:', contacts.length, 'contacts');
    } catch (error) {
      console.error('❌ Erreur sauvegarde cache contacts:', error);
    }
  }

  /**
   * Récupère les contacts depuis le cache
   * @returns Promise<Contact[] | null> - Contacts en cache ou null si invalide/inexistant
   */
  static async getContacts(): Promise<Contact[] | null> {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.CONTACTS);
      
      if (!cachedData) {
        console.log('📭 Aucun cache contacts trouvé');
        return null;
      }

      const cacheData: CacheData<Contact[]> = JSON.parse(cachedData);
      
      // Vérifier la version du cache
      if (cacheData.version !== CACHE_VERSION) {
        console.log('🔄 Cache contacts obsolète (version différente)');
        await this.clearContactsCache();
        return null;
      }

      // Vérifier la durée de validité
      const isExpired = Date.now() - cacheData.timestamp > CACHE_CONFIG.DURATION;
      
      if (isExpired) {
        console.log('⏰ Cache contacts expiré');
        await this.clearContactsCache();
        return null;
      }

      console.log('📖 Cache contacts récupéré:', cacheData.data.length, 'contacts');
      return cacheData.data;
    } catch (error) {
      console.error('❌ Erreur récupération cache contacts:', error);
      await this.clearContactsCache();
      return null;
    }
  }

  /**
   * Vérifie si le cache est valide sans le récupérer
   * @returns Promise<boolean> - True si le cache est valide
   */
  static async isContactsCacheValid(): Promise<boolean> {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.CONTACTS);
      
      if (!cachedData) {
        return false;
      }

      const cacheData: CacheData<Contact[]> = JSON.parse(cachedData);
      
      // Vérifier la version
      if (cacheData.version !== CACHE_VERSION) {
        return false;
      }

      // Vérifier la durée
      const isExpired = Date.now() - cacheData.timestamp > CACHE_CONFIG.DURATION;
      return !isExpired;
    } catch (error) {
      console.error('❌ Erreur vérification cache:', error);
      return false;
    }
  }

  /**
   * Récupère la date de dernière mise à jour du cache
   * @returns Promise<Date | null> - Date de dernière mise à jour
   */
  static async getLastUpdateTime(): Promise<Date | null> {
    try {
      const timestamp = await AsyncStorage.getItem(CACHE_KEYS.LAST_UPDATE);
      return timestamp ? new Date(parseInt(timestamp)) : null;
    } catch (error) {
      console.error('❌ Erreur récupération date cache:', error);
      return null;
    }
  }

  /**
   * Efface le cache des contacts
   */
  static async clearContactsCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        CACHE_KEYS.CONTACTS,
        CACHE_KEYS.LAST_UPDATE,
      ]);
      console.log('🗑️ Cache contacts effacé');
    } catch (error) {
      console.error('❌ Erreur effacement cache contacts:', error);
    }
  }

  /**
   * Efface tout le cache de l'application
   */
  static async clearAllCache(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log('🗑️ Tout le cache effacé');
    } catch (error) {
      console.error('❌ Erreur effacement cache complet:', error);
    }
  }

  /**
   * Récupère les statistiques du cache
   * @returns Promise<object> - Statistiques du cache
   */
  static async getCacheStats(): Promise<{
    hasValidCache: boolean;
    lastUpdate: Date | null;
    cacheAge: number | null;
    contactCount: number | null;
  }> {
    try {
      const hasValidCache = await this.isContactsCacheValid();
      const lastUpdate = await this.getLastUpdateTime();
      
      let cacheAge = null;
      let contactCount = null;
      
      if (lastUpdate) {
        cacheAge = Date.now() - lastUpdate.getTime();
      }
      
      if (hasValidCache) {
        const contacts = await this.getContacts();
        contactCount = contacts?.length || 0;
      }

      return {
        hasValidCache,
        lastUpdate,
        cacheAge,
        contactCount,
      };
    } catch (error) {
      console.error('❌ Erreur récupération stats cache:', error);
      return {
        hasValidCache: false,
        lastUpdate: null,
        cacheAge: null,
        contactCount: null,
      };
    }
  }
}
