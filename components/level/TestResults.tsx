import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TestResultsProps } from '@/types/level';

export default function TestResults({
  score,
  totalQuestions,
  hasPassed,
  error,
  onBackToTest,
  onReturnHome,
}: TestResultsProps) {
  const { t, colors } = useLanguage();

  const scorePercentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <View style={[
      styles.resultsContainer, 
      { 
        backgroundColor: colors.card, 
        shadowColor: colors.shadow 
      }
    ]}>
      <Text style={[styles.resultsTitle, { color: colors.text }]}>
        {t('testResults')}
      </Text>
      
      <View style={styles.scoreContainer}>
        <Text style={[styles.resultsScore, { color: colors.textSecondary }]}>
          {t('score')}: {score}/{totalQuestions}
        </Text>
        <Text style={[styles.scorePercentage, { color: colors.textSecondary }]}>
          ({scorePercentage}%)
        </Text>
      </View>

      {hasPassed ? (
        <View style={styles.statusContainer}>
          <Text style={[styles.resultsPassed, { color: colors.success }]}>
            🎉 {t('congratulations')}
          </Text>
          <Text style={[styles.passedSubtext, { color: colors.textSecondary }]}>
            {t('levelCompleted')}
          </Text>
        </View>
      ) : (
        <View style={styles.statusContainer}>
          <Text style={[styles.resultsFailed, { color: colors.error }]}>
            {t('tryAgain')}
          </Text>
          <Text style={[styles.failedSubtext, { color: colors.textSecondary }]}>
            {t('needPerfectScore')}
          </Text>
        </View>
      )}

      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      )}

      <View style={styles.resultsButtons}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: colors.secondary },
            pressed && styles.buttonPressed
          ]}
          onPress={onBackToTest}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>
            {t('backToTest')}
          </Text>
        </Pressable>
        
        <Pressable
          style={({ pressed }) => [
            styles.homeButton,
            { backgroundColor: colors.primary },
            pressed && styles.buttonPressed
          ]}
          onPress={onReturnHome}
        >
          <Text style={[styles.homeButtonText, { color: '#ffffff' }]}>
            {t('returnHome')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultsContainer: {
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
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsScore: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  scorePercentage: {
    fontSize: 16,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultsPassed: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  passedSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  resultsFailed: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  failedSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  resultsButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  backButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});