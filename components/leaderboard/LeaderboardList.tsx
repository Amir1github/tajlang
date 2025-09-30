import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import { LeaderboardUser } from '@/types/leaderboard';
import { LeaderboardItem } from '@/components/LeaderboardItem';

interface LeaderboardListProps {
  data: LeaderboardUser[];
  loading: boolean;
  colors: any;
  t: (key: string) => string;
  onUserPress: (user: LeaderboardUser) => void;
}

export function LeaderboardList({ 
  data, 
  loading, 
  colors, 
  t, 
  onUserPress 
}: LeaderboardListProps) {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          {t('loading_top_learners')}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <LeaderboardItem 
          item={item} 
          colors={colors} 
          onPress={onUserPress}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.leaderboardList}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyIcon, { color: colors.textSecondary }]}>
            🔍
          </Text>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            {t('no_results_found')}
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            {t('try_adjusting_filters')}
          </Text>
        </View>
      }
      showsVerticalScrollIndicator={Platform.OS === 'web'}
      style={styles.scrollContainer}
    />
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      overflowY: 'auto',
      scrollbarWidth: 'thin',
    }),
  },
  leaderboardList: {
    gap: 12,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});