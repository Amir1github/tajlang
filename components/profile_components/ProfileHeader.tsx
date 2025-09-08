import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Platform } from 'react-native';
import { Settings } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileHeaderProps {
  onSettingsPress: () => void;
}

export default function ProfileHeader({ onSettingsPress }: ProfileHeaderProps) {
  const { t, colors } = useLanguage();

  return (
    <View style={styles.headerContainer}>
      <Image 
        source={require('@/assets/images/icon.png')} 
        style={styles.headerIcon} 
        resizeMode="contain"
      />
      <View style={styles.headerTextContainer}>
        <Text style={[styles.header, { color: colors.text }]}>{t('profile')}</Text>
        <Text style={[styles.subHeader, { color: colors.textSecondary }]}>
          {t('profile_description')}
        </Text>
      </View>
      <Pressable 
        style={styles.settingsButton}
        onPress={onSettingsPress}
      >
        <Settings size={24} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingTop: Platform.select({ ios: 8, android: 16, default: 0 }),
  },
  headerIcon: {
    width: Platform.select({ web: 56, default: 64 }),
    height: Platform.select({ web: 56, default: 64 }),
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    fontSize: Platform.select({ web: 28, default: 32 }),
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: Platform.select({ web: 14, default: 16 }),
    marginTop: 4,
  },
  settingsButton: {
    padding: 8,
  },
});