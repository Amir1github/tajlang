import { Redirect, SplashScreen, Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import Head from 'expo-router/head';

function RootLayoutContent() {
  const { session, loading } = useAuth();
  const { colors } = useLanguage();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    };
    prepare();
  }, []);

  if (!appReady || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Head>
        <title>Tajlang</title>
        <meta name="description" content="Learn Tajik with Tajlang" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Tajlang" />
        <meta property="og:description" content="The best online service for learning Tajik" />
        <meta property="og:image" content="https://tajlang.netlify.app/preview.png" />
        <meta property="og:url" content="https://tajlang.netlify.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tajlang" />
        <meta name="twitter:description" content="The best online service for learning Tajik" />
        <meta name="twitter:image" content="https://tajlang.netlify.app/preview.png" />
      </Head>

      {!session ? (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="auth/sign-in" />
            <Stack.Screen name="auth/sign-up" />
            <Stack.Screen name="auth/callback" />
          </Stack>
          <Redirect href="/auth/sign-in" />
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="level/[id]" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
      )}
    </>
  );
}

// 💡 Экспорт с обёрткой LanguageProvider
export default function RootLayout() {
  return (
    <LanguageProvider>
      <RootLayoutContent />
    </LanguageProvider>
  );
}
