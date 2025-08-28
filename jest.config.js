module.exports = {
  // Configuration de base
  preset: 'jest-expo',
  
  // Dossiers à tester
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)'
  ],
  
  // Extensions de fichiers supportées
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Environnement de test
  testEnvironment: 'node',
  
  // Timeout des tests
  testTimeout: 10000,
  
  // Verbosité
  verbose: true
};
