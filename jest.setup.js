// Mock des modules Expo
jest.mock('expo-av', () => ({
  Audio: {
    Sound: jest.fn().mockImplementation(() => ({
      loadAsync: jest.fn(),
      playAsync: jest.fn(),
      unloadAsync: jest.fn(),
    })),
  },
}));

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
}));

jest.mock('expo-contacts', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getContactsAsync: jest.fn().mockResolvedValue({
    data: [
      {
        id: '1',
        name: 'Test Contact',
        phoneNumbers: [{ number: '0123456789' }],
        image: null,
      },
    ],
  }),
  addContactAsync: jest.fn().mockResolvedValue({ id: 'new-id' }),
}));

jest.mock('expo-battery', () => ({
  getBatteryLevelAsync: jest.fn().mockResolvedValue(0.75),
  getBatteryStateAsync: jest.fn().mockResolvedValue(2), // 2 = CHARGING
}));

jest.mock('expo-linking', () => ({
  openURL: jest.fn(),
}));

// Mock des modules React Native
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn().mockReturnValue({
    width: 375,
    height: 812,
    scale: 3,
    fontScale: 1,
  }),
}));

// Mock de Vibration
jest.mock('react-native/Libraries/Vibration/Vibration', () => ({
  vibrate: jest.fn(),
}));

// Mock de StatusBar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Configuration globale
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
