import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AlphabetButton() {
  const { language, colors } = useLanguage();

  return (
    <Pressable 
      style={[
        styles.alphabetButton, 
        { backgroundColor: colors.card, borderColor: colors.border }
      ]}
      onPress={() => router.push('/alphabet')}
    >
      <View style={styles.alphabetButtonContent}>
        <Text style={[styles.alphabetButtonText, { color: colors.primary }]}>
          {language === 'ru' ? 'Алфавит' : 'Alphabet'}
        </Text>
        <Text style={[styles.alphabetButtonSubtext, { color: colors.textSecondary }]}>
          {language === 'ru' ? 'Изучите таджикский алфавит' : 'Learn Tajik alphabet'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  alphabetButton: {
    width: '40%',
    alignSelf: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
    }),
    borderWidth: 1,
  },
  alphabetButtonContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  alphabetButtonText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  alphabetButtonSubtext: {
    fontSize: 14,
  },
});