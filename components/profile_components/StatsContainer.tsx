import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Award, Flame } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

interface Stat {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface StatsContainerProps {
  completedLevels: number;
  bestStreak: number;
}

export default function StatsContainer({ completedLevels, bestStreak }: StatsContainerProps) {
  const { t, colors } = useLanguage();

  const stats: Stat[] = [
    {
      icon: <Award size={24} color="#6366f1" />,
      label: t('levelsCompleted'),
      value: completedLevels.toString(),
    },
    {
      icon: <Flame size={24} color="#6366f1" />,
      label: t('bestStreak'),
      value: bestStreak.toString(),
    },
  ];

  return (
    <View style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <View key={index} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {stat.icon}
          <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  statCard: {
    width: Platform.select({ web: 160, default: '48%' }),
    minWidth: 160,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
    borderWidth: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});