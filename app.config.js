export default ({ config }) => ({
  name: 'Tajlang',
  slug: 'bolt-expo-nativewind',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'tajlang.netlify.app',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    //image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  ...config,
  
  ios: {
    supportsTablet: true
  },
  web: {
    bundler: 'metro',
    output: 'single'
  },
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true
  },
  android: {
    ...config.android,
    package: "com.tajlang.netlify" // <- сюда твой уникальный идентификатор
  },
  ios: {
    ...config.ios,
    bundleIdentifier: "com.tajlang.netlify"
  },
  
  extra: {
    eas: {
      projectId: "972957ad-f55e-4083-98ca-0e5175085f49"
    },
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    EXPO_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY,
    EXPO_PUBLIC_GOOGLE_GEMINI_API_URL: process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_URL,
    EXPO_PUBLIC_GOOGLE_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
    EXPO_PUBLIC_EMAILJS_SERVICE_ID: process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID,
    EXPO_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID,
    EXPO_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY
    
  },
  router: {
    experimental: {
      web: {
        onlyHashRouting: true
      }
    }
  }
});