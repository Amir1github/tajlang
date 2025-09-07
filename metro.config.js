const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Настройки для веба
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Отключаем генерацию ключей навигации для веба
if (process.env.EXPO_PLATFORM === 'web') {
  config.transformer.minifierConfig = {
    keep_fargs: true,
    mangle: {
      keep_fnames: true,
    },
  };
}

module.exports = config;