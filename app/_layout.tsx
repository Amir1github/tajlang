import { Redirect, SplashScreen, Stack, useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Pressable, TouchableOpacity, Animated, Platform } from 'react-native';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import Head from 'expo-router/head';
import { Book, Trophy, User, CirclePlus as PlusCircle, Languages, MessageSquare, FileText } from 'lucide-react-native';
export const unstable_settings = {
  initialRouteName: "index", // твой главный экран
};
// Компонент навигационного бара
function NavigationBar() {
  const { colors, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <View style={[styles.navigationBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <Pressable 
        style={styles.navButton} 
        onPress={() => router.replace('/')}
      >
        <Book size={24} color={isActive('/') ? colors.primary : colors.textSecondary} />
        <Text style={[
          styles.navButtonText, 
          { color: isActive('/') ? colors.primary : colors.textSecondary }
        ]}>
          {t('learn')}
        </Text>
      </Pressable>
      
      <Pressable 
        style={styles.navButton} 
        onPress={() => router.replace('/leaderboard')}
      >
        <Trophy size={24} color={isActive('/leaderboard') ? colors.primary : colors.textSecondary} />
        <Text style={[
          styles.navButtonText, 
          { color: isActive('/leaderboard') ? colors.primary : colors.textSecondary }
        ]}>
          {t('leaderboard')}
        </Text>
      </Pressable>
      
      <Pressable 
        style={styles.navButton} 
        onPress={() => router.replace('/profile')}
      >
        <User size={24} color={isActive('/profile') ? colors.primary : colors.textSecondary} />
        <Text style={[
          styles.navButtonText, 
          { color: isActive('/profile') ? colors.primary : colors.textSecondary }
        ]}>
          {t('profile')}
        </Text>
      </Pressable>
    </View>
  );
}

// Компонент FAB с меню
function FloatingActionButton() {
  const { colors, t } = useLanguage();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  
  const toggleMenu = () => {
    Animated.timing(animation, {
      toValue: menuVisible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setMenuVisible(!menuVisible);
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -10],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleTranslatorPress = () => {
    setMenuVisible(false);
    router.push('/translator');
  };

  const handleChatAssistantPress = () => {
    setMenuVisible(false);
    router.push('/chat');
  };

  

  return (
    <View style={styles.fabContainer}>
      <TouchableOpacity onPress={toggleMenu} style={[styles.fab, { backgroundColor: colors.primary }]}>
        <PlusCircle size={28} color="#fff" fill={colors.primary} />
      </TouchableOpacity>

      {menuVisible && (
        <Animated.View 
          style={[
            styles.dropdownMenu,
            { backgroundColor: colors.card, shadowColor: colors.shadow || '#000' },
            {
              opacity,
              transform: [{ translateY }],
            }
          ]}
        >
          <TouchableOpacity style={styles.menuItem} onPress={handleTranslatorPress}>
            <Languages size={20} color={colors.primary} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: colors.text }]}>{t('translator')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleChatAssistantPress}>
            <MessageSquare size={20} color={colors.primary} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: colors.text }]}>{t('chatAssistant')}</Text>
          </TouchableOpacity>
          
          
        </Animated.View>
      )}
    </View>
  );
}

// Основной контент с навигацией
function AppWithNavigation() {
  const { colors } = useLanguage();
  const pathname = usePathname();
  
  // Страницы где не нужно показывать навигацию
  const hideNavigationRoutes = ['/auth/sign-in', '/auth/sign-up', '/auth/callback', '/level'];
  const shouldShowNavigation = !hideNavigationRoutes.some(route => pathname?.startsWith(route));

  return (
    <View style={[styles.appContainer, { backgroundColor: colors.background }]}>
      <View style={[styles.contentContainer, shouldShowNavigation && styles.contentWithNavigation]}>
        <Stack screenOptions={{ headerShown: false, animation: 'none' }} initialRouteName="index">
          <Stack.Screen name="index" />
          <Stack.Screen name="leaderboard" />
          <Stack.Screen name="profile" />
       
        </Stack>
      </View>
      
      {shouldShowNavigation && (
        <>
          <NavigationBar />
          <FloatingActionButton />
        </>
      )}
    </View>
  );
}

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
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Head>
        <title>Tajlang</title>
        <meta name="description" content="Learn Tajik with Tajlang" />
        <link rel="icon" type="image/x-icon" href="https://tajlang.netlify.app/favicon.ico" />

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
        <View style={[styles.appContainer, { backgroundColor: colors.background }]}>
          <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="auth/sign-in" />
            <Stack.Screen name="auth/sign-up" />
            <Stack.Screen name="auth/callback" />
          </Stack>
          <Redirect href="/auth/sign-in" />
        </View>
      ) : (
        <AppWithNavigation />
      )}
    </>
  );
}

// Экспорт с обёрткой LanguageProvider
export default function RootLayout() {
  return (
    <LanguageProvider>
      <RootLayoutContent />
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  contentWithNavigation: {
    paddingBottom: 50, // Space for navigation bar
  },
  navigationBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    height: 60,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navButtonText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 80, // Above navigation bar
    right: 20,
    alignItems: 'flex-end',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  dropdownMenu: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 180,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
  },
});