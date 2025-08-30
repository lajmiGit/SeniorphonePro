const { device, element, by, expect } = require('detox');

describe('SeniorPhonePro E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Navigation Principale', () => {
    it('devrait naviguer entre les écrans principaux', async () => {
      // Vérifier que l'écran d'accueil est visible
      await expect(element(by.id('navigation-screen'))).toBeVisible();
      
      // Aller à l'écran téléphone
      await element(by.id('phone-button')).tap();
      await expect(element(by.id('phone-screen'))).toBeVisible();
      
      // Retourner à l'accueil
      await element(by.id('home-button')).tap();
      await expect(element(by.id('navigation-screen'))).toBeVisible();
      
      // Aller aux contacts
      await element(by.id('contacts-button')).tap();
      await expect(element(by.id('contacts-screen'))).toBeVisible();
    });
  });

  describe('DialPad - Composition de Numéros', () => {
    beforeEach(async () => {
      await element(by.id('phone-button')).tap();
    });

    it('devrait composer un numéro de téléphone complet', async () => {
      // Composer le numéro 0123456789
      const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      
      for (const num of numbers) {
        await element(by.id(`dial-button-${num}`)).tap();
        await device.pause(100); // Pause pour la vibration
      }
      
      // Vérifier que le numéro s'affiche correctement formaté
      await expect(element(by.id('phone-display'))).toHaveText('01 23 45 67 89');
    });

    it('devrait supprimer des chiffres avec le bouton de suppression', async () => {
      // Composer 123
      await element(by.id('dial-button-1')).tap();
      await element(by.id('dial-button-2')).tap();
      await element(by.id('dial-button-3')).tap();
      
      // Vérifier l'affichage
      await expect(element(by.id('phone-display'))).toHaveText('123');
      
      // Supprimer un chiffre
      await element(by.id('delete-button')).tap();
      
      // Vérifier que le chiffre a été supprimé
      await expect(element(by.id('phone-display'))).toHaveText('12');
    });

    it('devrait utiliser les boutons spéciaux * et #', async () => {
      // Tester le bouton *
      await element(by.id('dial-button-*')).tap();
      await expect(element(by.id('phone-display'))).toHaveText('*');
      
      // Supprimer et tester le bouton #
      await element(by.id('delete-button')).tap();
      await element(by.id('dial-button-#')).tap();
      await expect(element(by.id('phone-display'))).toHaveText('#');
    });
  });

  describe('PhoneDisplay - Modal de Zoom', () => {
    beforeEach(async () => {
      await element(by.id('phone-button')).tap();
    });

    it('devrait ouvrir le modal de zoom en tapant sur l\'affichage', async () => {
      // Composer un numéro d'abord
      await element(by.id('dial-button-1')).tap();
      await element(by.id('dial-button-2')).tap();
      await element(by.id('dial-button-3')).tap();
      
      // Taper sur l'affichage pour ouvrir le modal
      await element(by.id('phone-display')).tap();
      
      // Vérifier que le modal s'ouvre
      await expect(element(by.id('zoom-modal'))).toBeVisible();
      await expect(element(by.id('zoom-number'))).toHaveText('123');
    });

    it('devrait fermer le modal en tapant à nouveau', async () => {
      // Ouvrir le modal
      await element(by.id('phone-display')).tap();
      await expect(element(by.id('zoom-modal'))).toBeVisible();
      
      // Fermer le modal
      await element(by.id('zoom-modal')).tap();
      
      // Vérifier que le modal est fermé
      await expect(element(by.id('zoom-modal'))).not.toBeVisible();
    });
  });

  describe('Contacts - Gestion des Contacts', () => {
    beforeEach(async () => {
      await element(by.id('contacts-button')).tap();
    });

    it('devrait afficher la liste des contacts', async () => {
      // Vérifier que la liste s'affiche
      await expect(element(by.id('contacts-list'))).toBeVisible();
      
      // Vérifier qu'il y a au moins un contact
      await expect(element(by.id('contact-item-0'))).toBeVisible();
    });

    it('devrait sélectionner un contact et ouvrir l\'écran d\'appel', async () => {
      // Sélectionner le premier contact
      await element(by.id('contact-item-0')).tap();
      
      // Vérifier que l'écran d'appel s'ouvre
      await expect(element(by.id('call-screen'))).toBeVisible();
      await expect(element(by.id('contact-name'))).toBeVisible();
      await expect(element(by.id('contact-number'))).toBeVisible();
    });

    it('devrait ajouter un nouveau contact', async () => {
      // Appuyer sur le bouton d'ajout
      await element(by.id('add-contact-button')).tap();
      
      // Vérifier que l'écran de création s'ouvre
      await expect(element(by.id('create-contact-screen'))).toBeVisible();
    });
  });

  describe('CallScreen - Confirmation d\'Appel', () => {
    beforeEach(async () => {
      await element(by.id('contacts-button')).tap();
      await element(by.id('contact-item-0')).tap();
    });

    it('devrait ouvrir le modal de confirmation d\'appel', async () => {
      // Appuyer sur le bouton d'appel
      await element(by.id('call-button')).tap();
      
      // Vérifier que le modal de confirmation s'ouvre
      await expect(element(by.id('call-confirm-modal'))).toBeVisible();
      await expect(element(by.id('confirm-yes-button'))).toBeVisible();
      await expect(element(by.id('confirm-no-button'))).toBeVisible();
    });

    it('devrait confirmer l\'appel', async () => {
      // Ouvrir le modal de confirmation
      await element(by.id('call-button')).tap();
      
      // Confirmer l'appel
      await element(by.id('confirm-yes-button')).tap();
      
      // Vérifier que le modal se ferme
      await expect(element(by.id('call-confirm-modal'))).not.toBeVisible();
    });

    it('devrait annuler l\'appel', async () => {
      // Ouvrir le modal de confirmation
      await element(by.id('call-button')).tap();
      
      // Annuler l'appel
      await element(by.id('confirm-no-button')).tap();
      
      // Vérifier que le modal se ferme
      await expect(element(by.id('call-confirm-modal'))).not.toBeVisible();
    });
  });

  describe('Accessibilité - Spécifique aux Seniors', () => {
    it('devrait avoir des boutons suffisamment grands pour le tactile', async () => {
      await element(by.id('phone-button')).tap();
      
      // Vérifier la taille des boutons du dialpad
      const button = element(by.id('dial-button-1'));
      const buttonSize = await button.getAttributes();
      
      // Les boutons doivent faire au moins 44x44 points (recommandation Apple)
      expect(buttonSize.width).toBeGreaterThan(44);
      expect(buttonSize.height).toBeGreaterThan(44);
    });

    it('devrait avoir un contraste suffisant pour la lisibilité', async () => {
      await element(by.id('phone-button')).tap();
      
      // Vérifier le contraste du texte d'affichage
      const textElement = element(by.id('phone-display'));
      const textColor = await textElement.getAttributes();
      
      // Le texte ne doit pas être blanc sur fond blanc
      expect(textColor.color).not.toBe('#FFFFFF');
    });

    it('devrait avoir des espacements suffisants entre les boutons', async () => {
      await element(by.id('phone-button')).tap();
      
      // Vérifier l'espacement entre les boutons
      const button1 = element(by.id('dial-button-1'));
      const button2 = element(by.id('dial-button-2'));
      
      const pos1 = await button1.getAttributes();
      const pos2 = await button2.getAttributes();
      
      // L'espacement doit être suffisant pour éviter les touches accidentelles
      const spacing = pos2.x - (pos1.x + pos1.width);
      expect(spacing).toBeGreaterThan(5);
    });
  });

  describe('Performance - Réactivité de l\'Interface', () => {
    it('devrait répondre rapidement aux interactions', async () => {
      await element(by.id('phone-button')).tap();
      
      const startTime = Date.now();
      await element(by.id('dial-button-1')).tap();
      const responseTime = Date.now() - startTime;
      
      // La réponse doit être rapide (< 100ms)
      expect(responseTime).toBeLessThan(100);
    });

    it('devrait charger rapidement les écrans', async () => {
      const startTime = Date.now();
      await element(by.id('contacts-button')).tap();
      const loadTime = Date.now() - startTime;
      
      // Le chargement doit être rapide (< 1 seconde)
      expect(loadTime).toBeLessThan(1000);
    });
  });

  describe('Gestion des Erreurs', () => {
    it('devrait gérer gracieusement les erreurs de réseau', async () => {
      // Simuler une erreur de réseau (nécessite une configuration spéciale)
      await element(by.id('contacts-button')).tap();
      
      // Vérifier qu'un message d'erreur approprié s'affiche
      await expect(element(by.id('error-message'))).toBeVisible();
    });

    it('devrait gérer les cas où aucun contact n\'est disponible', async () => {
      await element(by.id('contacts-button')).tap();
      
      // Vérifier qu'un message approprié s'affiche
      await expect(element(by.id('no-contacts-message'))).toBeVisible();
    });
  });

  describe('Tests de Régression', () => {
    it('devrait maintenir l\'état correct après plusieurs navigations', async () => {
      // Naviguer plusieurs fois entre les écrans
      for (let i = 0; i < 5; i++) {
        await element(by.id('phone-button')).tap();
        await element(by.id('home-button')).tap();
        await element(by.id('contacts-button')).tap();
        await element(by.id('home-button')).tap();
      }
      
      // Vérifier que l'application fonctionne toujours correctement
      await expect(element(by.id('navigation-screen'))).toBeVisible();
    });

    it('devrait gérer correctement les changements de taille d\'écran', async () => {
      // Simuler un changement d'orientation (nécessite une configuration spéciale)
      await device.setOrientation('landscape');
      await device.pause(1000);
      
      // Vérifier que l'interface s'adapte
      await expect(element(by.id('phone-screen'))).toBeVisible();
      
      // Remettre en portrait
      await device.setOrientation('portrait');
      await device.pause(1000);
    });
  });
});
