import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { ChevronLeft, CircleCheck, CircleX, Home } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import type { LevelHeaderProps } from '@/types/level';

export default function LevelHeader({
  title,
  hasAttempted,
  hasPassed,
  isLevelCompleted,
  showTest,
  showResults,
  onHomePress,
}: LevelHeaderProps) {
  const { t, colors } = useLanguage();

  const handleBackPress = () => {
    router.back();
  };

  const handleHomePress = () => {
    if (showTest && !showResults) {
      // Показываем подтверждение перед выходом из теста
      Alert.alert(
        t('exitTestTitle'),
        t('exitTestMessage'),
        [
          {
            text: t('cancel'),
            style: 'cancel',
          },
          {
            text: t('exit'),
            onPress: onHomePress,
          },
        ]
      );
    } else {
      onHomePress();
    }
  };

  const getStatusIcon = () => {
    if (!hasAttempted && !isLevelCompleted) return null;
    
    const isPassed = hasPassed || isLevelCompleted;
    return isPassed ? (
      <CircleCheck size={24} color={colors.success} style={styles.statusIcon} />
    ) : (
      <CircleX size={24} color={colors.error} style={styles.statusIcon} />
    );
  };

  return (
    <Stack.Screen
      options={{
        headerLeft: () => (
          <Pressable 
            onPress={handleBackPress} 
            style={[styles.backButton, { backgroundColor: colors.card }]}
          >
            <ChevronLeft size={24} color={colors.textSecondary} />
          </Pressable>
        ),
        headerRight: () => (
          <View style={styles.headerRight}>
            {getStatusIcon()}
            <Pressable onPress={handleHomePress} style={styles.exitButton}>
              <Home size={24} color={colors.textSecondary} />
            </Pressable>
          </View>
        ),
        title: title,
      }}
    />
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statusIcon: {
    marginRight: 12,
  },
  exitButton: {
    padding: 8,
  },
});