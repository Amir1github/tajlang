const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      mode: env.mode || 'development',
    },
    argv
  );

  // Настройки для чистых URL
  config.output.publicPath = '/';
  
  // История без ключей
  config.resolve.alias = {
    ...config.resolve.alias,
    '@expo/vector-icons': '@expo/vector-icons/build/vendor-react-native-vector-icons',
  };

  // Настройка для SPA
  config.devServer = {
    ...config.devServer,
    historyApiFallback: {
      index: '/index.html',
    },
  };

  return config;
};