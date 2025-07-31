import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';

type LevelInstructionsProps = {
  onStart: () => void;
};

export default function LevelInstructions({ onStart }: LevelInstructionsProps) {
  const { t, colors } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('instructions')}</Text>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('howToStudy')}</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>• {t('tapWordsInstruction')}</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>• {t('learnPronunciationInstruction')}</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>• {t('practiceExamplesInstruction')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('testInstructions')}</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>• {t('multipleChoiceInstruction')}</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>• {t('scoreRequirementInstruction')}</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>• {t('pointsExplanationInstruction')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('tips')}</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>• {t('reviewWordsInstruction')}</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>• {t('takeNotesInstruction')}</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>• {t('practiceRegularlyInstruction')}</Text>
      </View>

      <Pressable style={[styles.startButton, { backgroundColor: colors.primary }]} onPress={onStart}>
        <Text style={[styles.startButtonText, { color: '#ffffff' }]}>{t('startLearning')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  startButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});