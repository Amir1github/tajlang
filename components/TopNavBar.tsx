import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter, usePathname } from 'expo-router';

export default function TopNavBar() {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Pressable 
          style={styles.logoContainer}
          onPress={() => router.push('/')}
        >
          <Text style={styles.logo}>🇹🇯</Text>
          <Text style={styles.logoText}>{t('learn')}</Text>
        </Pressable>

        <View style={styles.nav}>
          <Pressable 
            style={[styles.navItem, isActive('/') && styles.navItemActive]}
            onPress={() => router.push('/')}
          >
            <Text style={[styles.navText, isActive('/') && styles.navTextActive]}>
              {t('home')}
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.navItem, isActive('/leaderboard') && styles.navItemActive]}
            onPress={() => router.push('/leaderboard')}
          >
            <Text style={[styles.navText, isActive('/leaderboard') && styles.navTextActive]}>
              {t('leaderboard')}
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.navItem, isActive('/profile') && styles.navItemActive]}
            onPress={() => router.push('/profile')}
          >
            <Text style={[styles.navText, isActive('/profile') && styles.navTextActive]}>
              {t('profile')}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    height: 64,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  nav: {
    flexDirection: 'row',
    gap: 4,
  },
  navItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: '#f3f4f6',
  },
  navText: {
    fontSize: 16,
    color: '#6b7280',
  },
  navTextActive: {
    color: '#1f2937',
    fontWeight: '600',
  },
});