import { View, Text, StyleSheet, FlatList, Image, Platform } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { supabase, getUserStatus } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { LeaderboardItem } from '@/components/LeaderboardItem';
import { UserProfileModal } from '@/components/UserProfileModal';
import { LeaderboardUser } from '@/types/leaderboard';

export default function LeaderboardScreen() {
  const { t, colors } = useLanguage();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  // ИСПРАВЛЕНО: добавлен useCallback и правильная обработка параметров
  const updateUserStatuses = useCallback(async (users?: LeaderboardUser[]) => {
    // Используем текущие данные если users не переданы
    const usersToUpdate = users || leaderboardData;
    
    if (usersToUpdate.length === 0) return;

    try {
      const updatedUsers = await Promise.all(
        usersToUpdate.map(async (user) => {
          const { status, lastSeen } = await getUserStatus(user.id);
          return {
            ...user,
            status,
            last_seen: lastSeen
          };
        })
      );
      
      setLeaderboardData(updatedUsers);
    } catch (error) {
      console.error('Error updating user statuses:', error);
    }
  }, [leaderboardData]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, description, avatar_url, xp_points, best_streak, status, last_seen, want_chats')
        .order('xp_points', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      const rankedData = (data || []).map((user, index) => ({
        ...user,
        rank: index + 1
      }));
      
      setLeaderboardData(rankedData);
      await updateUserStatuses(rankedData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserDetails = useCallback(async (userId: string) => {
    try {
      setLoadingUserDetails(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, description, avatar_url, xp_points, best_streak, status, last_seen, want_chats')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const { status, lastSeen } = await getUserStatus(userId);
      const userWithRank = leaderboardData.find(user => user.id === userId);
      
      const userDetails = {
        ...data,
        status,
        last_seen: lastSeen,
        rank: userWithRank?.rank || 0
      };
      
      setSelectedUser(userDetails);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setSelectedUser(null);
      setModalVisible(false);
    } finally {
      setLoadingUserDetails(false);
    }
  }, [leaderboardData]);

  const handleUserPress = useCallback(async (user: LeaderboardUser) => {
    try {
      setModalVisible(true);
      await fetchUserDetails(user.id);
    } catch (error) {
      console.error('Error handling user press:', error);
      setModalVisible(false);
    }
  }, [fetchUserDetails]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedUser(null);
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    // ИСПРАВЛЕНО: обновление статусов только если есть данные
    if (leaderboardData.length === 0) return;

    const statusInterval = setInterval(() => {
      updateUserStatuses();
    }, 30000);

    return () => clearInterval(statusInterval);
  }, [leaderboardData.length, updateUserStatuses]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.headerContainer}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.headerIcon} 
            resizeMode="contain"
          />
          <Text style={[styles.header, { color: colors.text }]}>Leaderboard</Text>
        </View>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading top learners...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Image 
          source={require('@/assets/images/icon.png')} 
          style={styles.headerIcon} 
          resizeMode="contain"
        />
        <View>
          <Text style={[styles.header, { color: colors.text }]}>{t('leaderboard')}</Text>
          <Text style={[styles.subHeader, { color: colors.textSecondary }]}>{t('top_learners')}</Text>
        </View>
      </View>
      
      <FlatList
        data={leaderboardData}
        renderItem={({ item }) => (
          <LeaderboardItem 
            item={item} 
            colors={colors} 
            onPress={handleUserPress}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.leaderboardList}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No learners found. Be the first!
          </Text>
        }
        showsVerticalScrollIndicator={Platform.OS === 'web'}
        style={styles.scrollContainer}
      />

      <UserProfileModal
        visible={modalVisible}
        user={selectedUser}
        loading={loadingUserDetails}
        colors={colors}
        t={t}
        onClose={closeModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    ...(Platform.OS === 'web' && {
      overflowY: 'auto',
      scrollbarWidth: 'thin',
    }),
  },
  container: {
    padding: 20,
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    width: 56,
    height: 56,
    marginRight: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
  },
  subHeader: {
    fontSize: 14,
    marginTop: 4,
  },
  leaderboardList: {
    gap: 12,
    paddingBottom: 16,
  },
  loadingText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 24,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 24,
    padding: 16,
  },
});