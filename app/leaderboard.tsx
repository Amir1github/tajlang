import { View, StyleSheet, Platform } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { supabase, getUserStatus } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserProfileModal } from '@/components/UserProfileModal';
import { LeaderboardUser } from '@/types/leaderboard';
import { LeaderboardHeader } from '@/components/leaderboard/LeaderboardHeader';
import { LeaderboardFilters } from '@/components/leaderboard/LeaderboardFilters';
import { LeaderboardList } from '@/components/leaderboard/LeaderboardList';
import { FilterOptions, SortOption } from '@/types/filters';

export default function LeaderboardScreen() {
  const { t, colors } = useLanguage();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [filteredData, setFilteredData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  
  // Состояния для поиска и фильтров
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    minXP: undefined,
    maxXP: undefined,
    minStreak: undefined,
    onlineStatus: undefined,
    wantChats: undefined,
    location: undefined, // Готово к добавлению локаций
  });
  const [sortOption, setSortOption] = useState<SortOption>('xp_desc');

  const updateUserStatuses = useCallback(async (users: LeaderboardUser[]) => {
    if (users.length === 0) return users;

    try {
      const updatedUsers = await Promise.all(
        users.map(async (user) => {
          const { status, lastSeen } = await getUserStatus(user.id);
          return {
            ...user,
            status,
            last_seen: lastSeen
          };
        })
      );
      
      return updatedUsers;
    } catch (error) {
      console.error('Error updating user statuses:', error);
      return users;
    }
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, description, avatar_url, background_image, xp_points, best_streak, status, last_seen, want_chats')
        .order('xp_points', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      const rankedData = (data || []).map((user, index) => ({
        ...user,
        rank: index + 1
      }));
      
      const updatedData = await updateUserStatuses(rankedData);
      setLeaderboardData(updatedData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [updateUserStatuses]);

  const applyFiltersAndSort = useCallback(() => {
    let result = [...leaderboardData];

    // Поиск по никнейму
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(user => 
        user.username.toLowerCase().includes(query)
      );
    }

    // Фильтрация по XP
    if (filters.minXP !== undefined) {
      result = result.filter(user => user.xp_points >= filters.minXP!);
    }
    if (filters.maxXP !== undefined) {
      result = result.filter(user => user.xp_points <= filters.maxXP!);
    }

    // Фильтрация по streak
    if (filters.minStreak !== undefined) {
      result = result.filter(user => user.best_streak >= filters.minStreak!);
    }

    // Фильтрация по статусу онлайн
    if (filters.onlineStatus !== undefined) {
      result = result.filter(user => user.status === filters.onlineStatus);
    }

    // Фильтрация по желанию общаться
    if (filters.wantChats !== undefined) {
      result = result.filter(user => user.want_chats === filters.wantChats);
    }

    // Фильтрация по локации (готово к использованию)
    if (filters.location) {
      result = result.filter(user => 
        user.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Сортировка
    switch (sortOption) {
      case 'xp_desc':
        result.sort((a, b) => b.xp_points - a.xp_points);
        break;
      case 'xp_asc':
        result.sort((a, b) => a.xp_points - b.xp_points);
        break;
      case 'streak_desc':
        result.sort((a, b) => b.best_streak - a.best_streak);
        break;
      case 'streak_asc':
        result.sort((a, b) => a.best_streak - b.best_streak);
        break;
      case 'last_seen':
        result.sort((a, b) => {
          const dateA = a.last_seen ? new Date(a.last_seen).getTime() : 0;
          const dateB = b.last_seen ? new Date(b.last_seen).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'username':
        result.sort((a, b) => a.username.localeCompare(b.username));
        break;
    }

    // Обновляем ранги после фильтрации
    result = result.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    setFilteredData(result);
  }, [leaderboardData, searchQuery, filters, sortOption]);

  const fetchUserDetails = useCallback(async (userId: string) => {
    try {
      setLoadingUserDetails(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, description, avatar_url, background_image, xp_points, best_streak, status, last_seen, want_chats')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const { status, lastSeen } = await getUserStatus(userId);
      const userWithRank = filteredData.find(user => user.id === userId);
      
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
  }, [filteredData]);

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

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setFilters({
      minXP: undefined,
      maxXP: undefined,
      minStreak: undefined,
      onlineStatus: undefined,
      wantChats: undefined,
      location: undefined,
    });
    setSortOption('xp_desc');
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  useEffect(() => {
    if (leaderboardData.length === 0) return;

    const statusInterval = setInterval(async () => {
      const updated = await updateUserStatuses(leaderboardData);
      setLeaderboardData(updated);
    }, 30000);

    return () => clearInterval(statusInterval);
  }, [leaderboardData.length, updateUserStatuses]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LeaderboardHeader colors={colors} t={t} />
      
      <LeaderboardFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onResetFilters={handleResetFilters}
        colors={colors}
        t={t}
      />
      
      <LeaderboardList
        data={filteredData}
        loading={loading}
        colors={colors}
        t={t}
        onUserPress={handleUserPress}
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
  container: {
    padding: 20,
    flex: 1
  },
});