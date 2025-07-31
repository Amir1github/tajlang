import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import WordCard from '@/components/WordCard';
import LevelInstructions from '@/components/LevelInstructions';
import type { WordsSectionProps } from '@/types/level';

export default function WordsSection({
  words,
  isLevelCompleted,
  showInstructions,
  onStartInstructions,
  onStartTest,
}: WordsSectionProps) {
  const { t, colors } = useLanguage();

  if (showInstructions) {
    return <LevelInstructions onStart={onStartInstructions} />;
  }

  return (
    <View style={styles.container}>
      {/* Список слов */}
      <View style={styles.wordsContainer}>
        {words.map((word) => (
          <WordCard
            key={word.id}
            tajik={word.tajik}
            english={word.english}
            explanation={word.explanation}
            ru_explanation={word.ru_explanation}
            russian={word.russian}
            examples={word.examples}
          />
        ))}
      </View>

      {/* Состояние завершения или кнопка теста */}
      {isLevelCompleted ? (
        <CompletedLevelCard />
      ) : (
        <Pressable
          style={[styles.startTestButton, { backgroundColor: colors.primary }]}
          onPress={onStartTest}
        >
          <Text style={[styles.startTestButtonText, { color: '#ffffff' }]}>
            {t('startTest')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function CompletedLevelCard() {
  const { t, colors } = useLanguage();

  return (
    <View style={[
      styles.completedContainer, 
      { 
        backgroundColor: colors.card, 
        shadowColor: colors.shadow 
      }
    ]}>
      <Text style={[styles.completedText, { color: colors.success }]}>
        {t('levelAlreadyCompleted')}
      </Text>
      <Pressable
        style={[styles.returnButton, { backgroundColor: colors.primary }]}
        onPress={() => router.back()}
      >
        <Text style={[styles.returnButtonText, { color: '#ffffff' }]}>
          {t('goBack')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wordsContainer: {
    padding: 16,
    gap: 16,
  },
  startTestButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: 16,
  },
  startTestButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  completedContainer: {
    padding: 24,
    margin: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  completedText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  returnButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  returnButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});