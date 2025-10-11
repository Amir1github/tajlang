import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase, type Level, type UserProgress } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import LevelCard from './LevelCard';
import AlphabetButton from './AlphabetButton';

export default function LevelsTab() {
  const { user } = useAuth();
  const { t, colors } = useLanguage();
  const [levels, setLevels] = useState<Level[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLevels();
      fetchUserProgress();
    }
  }, [user]);

  async function fetchLevels() {
    try {
      const { data, error } = await supabase
        .from('levels')
        .select('*, en_title, ru_title, ru_description')
        .order('order_number');

      if (error) throw error;
      setLevels(data || []);
    } catch (error) {
      console.error('Error fetching levels:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserProgress() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserProgress(data || []);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  }

  const getLevelStatus = (levelId: string, orderNumber: number) => {
    const progress = userProgress.find(p => p.level_id === levelId);
    const previousLevelCompleted = orderNumber === 1 || 
      userProgress.some(p => 
        p.level_id === levels[orderNumber - 2]?.id && p.completed
      );

    return {
      completed: progress?.completed || false,
      unlocked: previousLevelCompleted,
    };
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          {t('loading')}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={levels}
      renderItem={({ item, index }) => (
        <LevelCard
          level={item}
          index={index}
          status={getLevelStatus(item.id, item.order_number)}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.levelsList}
      ListHeaderComponent={<AlphabetButton />}
      ListEmptyComponent={
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {t('noLevels')}
        </Text>
      }
      showsVerticalScrollIndicator={Platform.OS !== 'web'}
      style={styles.scrollContainer}
    />
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      overflowY: 'scroll',
      scrollbarWidth: 'thin',
    }),
  },
  levelsList: {
    paddingBottom: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 24,
  },
});