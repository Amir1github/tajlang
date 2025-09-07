export default {
  name: 'Tajlang',
  slug: 'bolt-expo-nativewind',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'tajlang.netlify.app',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
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
  extra: {
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
};