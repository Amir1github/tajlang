import { View, Text, StyleSheet, FlatList, Image, Platform, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { Crown, Award, Star, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Modal, ScrollView } from 'react-native';

type LeaderboardUser = {
  id: string;
  username: string;
  description: string;
  avatar_url: string;
  xp_points: number;
  best_streak: number;
  rank?: number;
};

export default function LeaderboardScreen() {
  const { t, colors } = useLanguage();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, description, avatar_url, xp_points, best_streak')
        .order('xp_points', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Add rank to each user
      const rankedData = (data || []).map((user, index) => ({
        ...user,
        rank: index + 1
      }));
      
      setLeaderboardData(rankedData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserDetails(userId: string) {
    try {
      setLoadingUserDetails(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, description, avatar_url, xp_points, best_streak')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Find the user's rank from the current leaderboard data
      const userWithRank = leaderboardData.find(user => user.id === userId);
      const userDetails = {
        ...data,
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
  }

  const handleUserPress = async (user: LeaderboardUser) => {
    try {
      setModalVisible(true);
      await fetchUserDetails(user.id);
    } catch (error) {
      console.error('Error handling user press:', error);
      setModalVisible(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };
  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#6366f1'; // Default purple
    }
  };

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Crown size={20} color="#FFD700" />;
      case 2: return <Award size={20} color="#C0C0C0" />;
      case 3: return <Award size={20} color="#CD7F32" />;
      default: return <Star size={20} color="#6366f1" />;
    }
  };

  const renderItem = ({ item }: { item: LeaderboardUser }) => (
    <Pressable 
      style={[
        styles.leaderboardItem,
        { backgroundColor: colors.card, borderColor: colors.border },
        item.rank === 1 && styles.firstPlace,
        item.rank === 2 && styles.secondPlace,
        item.rank === 3 && styles.thirdPlace,
      ]}
      onPress={() => handleUserPress(item)}
    >
      <View style={styles.rankContainer}>
        {getRankIcon(item.rank)}
        <Text style={[styles.rank, { color: getRankColor(item.rank) }]}>
          #{item.rank}
        </Text>
      </View>
      
      <Image
        source={{ uri: item.avatar_url || 'https://i.imgur.com/mCHMpLT.png' }}
        style={styles.avatar}
      />
      
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
          {item.username || 'Anonymous'}
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarBackground, { backgroundColor: colors.secondary }]}>
            <View 
              style={[
                styles.progressBar,
                { 
                  width: `${Math.min(100, (item.xp_points / 1000) * 100)}%`,
                  backgroundColor: getRankColor(item.rank),
                }
              ]}
            />
          </View>
        </View>
      </View>
      
      <Text style={[styles.points, { color: colors.primary }]}>
        {item.xp_points.toLocaleString()} XP
      </Text>
    </Pressable>
  );

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
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.leaderboardList}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No learners found. Be the first!</Text>
        }
        showsVerticalScrollIndicator={Platform.OS === 'web'}
        style={styles.scrollContainer}
      />

      {/* User Profile Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('profile')}
              </Text>
              <Pressable onPress={closeModal} style={styles.closeButton}>
                <X size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            {loadingUserDetails ? (
              <View style={styles.modalLoading}>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  {t('loading')}
                </Text>
              </View>
            ) : selectedUser ? (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.userDetailsContainer}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: selectedUser.avatar_url || 'https://i.imgur.com/mCHMpLT.png' }}
                      style={styles.modalAvatar}
                    />
                  </View>
                  {/* Rank Badge */}
                  <View style={[styles.rankBadge, { backgroundColor: colors.secondary }]}>
                    {getRankIcon(selectedUser.rank)}
                    <Text style={[styles.rankBadgeText, { color: getRankColor(selectedUser.rank) }]}>
                      #{selectedUser.rank}
                    </Text>
                  </View>

                  {/* Username */}
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                      {t('language') === 'ru' ? 'Ник:' : 'Nickname:'}
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {selectedUser.username || 'Anonymous'}
                    </Text>
                  </View>

                  {/* Description */}
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                      {t('language') === 'ru' ? 'Описание:' : 'Description:'}
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {selectedUser.description || (t('language') === 'ru' ? 'Нет описания' : 'No description')}
                    </Text>
                  </View>

                  {/* Points */}
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                      {t('language') === 'ru' ? 'Очки:' : 'Points:'}
                    </Text>
                    <Text style={[styles.detailValue, styles.pointsValue, { color: colors.primary }]}>
                      {selectedUser.xp_points.toLocaleString()} XP
                    </Text>
                  </View>

                  {/* Best Streak */}
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                      {t('language') === 'ru' ? 'Лучший рекорд:' : 'Best Streak:'}
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {selectedUser.best_streak || 0} {t('language') === 'ru' ? 'уроков' : 'lessons'}
                    </Text>
                  </View>

                  {/* Avatar at bottom */}
                  
                </View>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
      
      
    </View>
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
  container: {
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
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
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
  firstPlace: {
    borderColor: '#FFD700',
    borderWidth: 2,
    backgroundColor: '#FFF9C4',
  },
  secondPlace: {
    borderColor: '#C0C0C0',
    borderWidth: 2,
    backgroundColor: '#F5F5F5',
  },
  thirdPlace: {
    borderColor: '#CD7F32',
    borderWidth: 2,
    backgroundColor: '#FFECB3',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 50,
  },
  rank: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 6,
  },
  progressBarBackground: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  points: {
    fontSize: 14,
    fontWeight: '700',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalLoading: {
    padding: 40,
    alignItems: 'center',
  },
  userDetailsContainer: {
    gap: 20,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    alignSelf: 'center',
    minWidth: 80,
  },
  rankBadgeText: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  detailRow: {
    gap: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 18,
    lineHeight: 24,
  },
  pointsValue: {
    fontWeight: '700',
    fontSize: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#e2e8f0',
  },
});