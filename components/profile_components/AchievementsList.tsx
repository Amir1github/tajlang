import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Award } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import type { UserProgress, Level } from '@/lib/supabase';

interface AchievementsListProps {
  userProgress: UserProgress[];
  levels: Record<string, Level>;
}

export default function AchievementsList({ userProgress, levels }: AchievementsListProps) {
  const { t, colors } = useLanguage();

  const recentAchievements = userProgress.filter(p => p.completed).slice(0, 3);

  if (recentAchievements.length === 0) {
    return null;
  }

  return (
    <View style={styles.achievementsContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('recentAchievements')}</Text>
      {recentAchievements.map((progress, index) => {
        const level = levels[progress.level_id];
        return (
          <View key={index} style={[styles.achievement, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Award size={24} color={colors.primary} />
            <View style={styles.achievementInfo}>
              <Text style={[styles.achievementTitle, { color: colors.primary }]}>
                {level ? `${level.title} ${t('completed')}` : t('levelCompleted')}
              </Text>
              <Text style={[styles.achievementDate, { color: colors.textSecondary }]}>
                {t('points')}: {progress.score}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  achievementsContainer: {
    marginTop: 24,
    gap: 12,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
      },
    }),
    borderWidth: 1,
  },
  achievementInfo: {
    marginLeft: 12,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  achievementDate: {
    fontSize: 14,
    marginTop: 4,
  },
});