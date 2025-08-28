module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Pas de plugins Reanimated pour les tests
    ],
  };
};
