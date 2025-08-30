// Mock des modules Expo
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
}));

jest.mock('expo-contacts', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getContactsAsync: jest.fn().mockResolvedValue({
    data: [
      {
        ID: '1',
        id: '1',
        name: 'Jean Dupont',
        phoneNumbers: [{ number: '0123456789' }],
        image: null,
      },
      {
        ID: '2',
        id: '2',
        name: 'Marie Martin',
        phoneNumbers: [{ number: '0987654321' }],
        image: null,
      },
      {
        ID: '3',
        id: '3',
        name: 'Pierre Durand',
        phoneNumbers: [{ number: '0555666777' }],
        image: null,
      },
    ],
  }),
  addContactAsync: jest.fn().mockResolvedValue({ id: 'new-id' }),
  Fields: {
    ID: 'id',
    Name: 'name',
    PhoneNumbers: 'phoneNumbers',
    Image: 'image',
  },
}));

jest.mock('expo-battery', () => ({
  getBatteryLevelAsync: jest.fn().mockResolvedValue(0.75),
  getBatteryStateAsync: jest.fn().mockResolvedValue(2), // 2 = CHARGING
}));

jest.mock('expo-linking', () => ({
  openURL: jest.fn(),
}));

// Mock de Vibration
jest.mock('react-native/Libraries/Vibration/Vibration', () => ({
  vibrate: jest.fn(),
}));

// Mock de StatusBar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
  getAllKeys: jest.fn().mockResolvedValue([]),
  multiGet: jest.fn().mockResolvedValue([]),
  multiSet: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

// Mock global de Dimensions
global.Dimensions = {
  get: jest.fn().mockReturnValue({
    width: 375,
    height: 812,
    scale: 3,
    fontScale: 1,
  }),
};

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
