import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { VirtualKeyboardProps } from '../types';

/**
 * Écran clavier vide - Structure de base sans fonctionnalités
 */
export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Écran clavier vide */}
      <View style={styles.emptyKeyboard}>
        {/* Contenu vide */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  
  emptyKeyboard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
