import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  const { t, colors } = useLanguage();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
        {message || t('loading')}
      </Text>
    </View>
  );
}

type ErrorStateProps = {
  error: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
};

export function ErrorState({ error, onRetry, showHomeButton = true }: ErrorStateProps) {
  const { t, colors } = useLanguage();
  
  return (
    <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.errorText, { color: colors.error }]}>
        {error || t('levelNotFound')}
      </Text>
      
      <View style={styles.buttonContainer}>
        {onRetry && (
          <Pressable
            style={[styles.button, styles.retryButton, { backgroundColor: colors.secondary }]}
            onPress={onRetry}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              {t('retry')}
            </Text>
          </Pressable>
        )}
        
        {showHomeButton && (
          <Pressable
            style={[styles.button, styles.homeButton, { backgroundColor: colors.primary }]}
            onPress={() => router.replace('/')}
          >
            <Text style={[styles.buttonText, { color: '#ffffff' }]}>
              {t('returnHome')}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 300,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButton: {
    // Дополнительные стили для кнопки повтора
  },
  homeButton: {
    // Дополнительные стили для кнопки домой
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});