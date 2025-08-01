import { View, Text, StyleSheet, Pressable, Image, Animated } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRef, useEffect } from 'react';
import { router } from 'expo-router';

export default function OurTeamScreen() {
  const { t, colors, language } = useLanguage();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {language === 'ru' ? 'Наша команда' : 'Our Team'}
        </Text>
        <Pressable style={styles.homeButton} onPress={() => router.push('/')}>
          <Text style={[styles.homeText, { color: colors.primary }]}>
            {language === 'ru' ? 'Домой' : 'Home'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.memberContainer}>
  <Animated.Image
    source={require('@/assets/images/member1.jpg')}
    style={[
      styles.avatar,
      {
        transform: [{ scale: scaleAnim }],
        borderColor: colors.border,
      },
    ]}
    resizeMode="cover"
  />
  <Text style={[styles.nameText, { color: colors.text }]}>
    {language === 'ru' ? 'Хаитов Амир' : 'Khaitov Amir'}
  </Text>
  <Text style={[styles.roleText, { color: colors.textSecondary }]}>
    {language === 'ru' ? 'Разработчик сайта' : 'Website Developer'}
  </Text>
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  nameText: {
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 4,
},

  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  homeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  homeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    marginBottom: 16,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
