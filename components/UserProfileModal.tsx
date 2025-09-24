import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView, Image, Platform } from 'react-native';
import { X, Circle, Crown, Award, Star, MessageCircle } from 'lucide-react-native';
import { LeaderboardUser } from '@/types/leaderboard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { createChat } from '@/lib/supabase';
import { router } from 'expo-router';
interface UserProfileModalProps {
  visible: boolean;
  user: LeaderboardUser | null;
  loading: boolean;
  colors: any;
  t: (key: string) => string;
  onClose: () => void;
}

const getStatusColor = (status: 'online' | 'offline') => {
  return status === 'online' ? '#22c55e' : '#6b7280';
};
const { t, colors, language } = useLanguage();
const getStatusText = (status: 'online' | 'offline', lastSeen?: string | null, t?: (key: string) => string) => {
  if (status === 'online') {
    return t?.('online') || 'Online';
  }
  
  if (lastSeen) {
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  }
  
  return t?.('offline') || 'Offline';
};

const getRankColor = (rank: number) => {
  switch(rank) {
    case 1: return '#FFD700';
    case 2: return '#C0C0C0';
    case 3: return '#CD7F32';
    default: return '#6366f1';
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

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  visible,
  user,
  loading,
  colors,
  t,
  onClose
}) => {
  const { user: currentUser } = useAuth();

  const handleStartChat = async () => {
    if (!currentUser?.id || !user?.id) return;

    try {
      const { chat, error } = await createChat(currentUser.id, user.id);
      if (error) {
        console.error('Error creating chat:', error);
        return;
      }

      onClose();
      if (chat) {
        router.push(`/chat/${chat.id}`);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const canStartChat = user?.want_chats && user?.id !== currentUser?.id;
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('profile')}
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.modalLoading}>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                {t('loading')}
              </Text>
            </View>
          ) : user ? (
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.userDetailsContainer}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: user.avatar_url || 'https://i.imgur.com/mCHMpLT.png' }}
                    style={styles.modalAvatar}
                  />
                  <Circle 
                    size={16} 
                    color={getStatusColor(user.status || 'offline')} 
                    fill={getStatusColor(user.status || 'offline')}
                    style={styles.modalStatusIndicator}
                  />
                </View>

                {/* Rank Badge */}
                <View style={[styles.rankBadge, { backgroundColor: colors.secondary }]}>
                  {getRankIcon(user.rank)}
                  <Text style={[styles.rankBadgeText, { color: getRankColor(user.rank) }]}>
                    #{user.rank}
                  </Text>
                </View>

                {/* Username */}
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    {t('Nickname')}
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {user.username || 'Anonymous'}
                  </Text>
                </View>

                {/* Status */}
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  {t('Status')}
                  </Text>
                  <View style={styles.statusDetailContainer}>
                    <Circle 
                      size={8} 
                      color={getStatusColor(user.status || 'offline')} 
                      fill={getStatusColor(user.status || 'offline')}
                      style={styles.statusDot}
                    />
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {getStatusText(user.status || 'offline', user.last_seen, t)}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    {t('Description')}
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {user.description || (t('NoDescription'))}
                  </Text>
                </View>

                {/* Points */}
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    {t('Points')}
                  </Text>
                  <Text style={[styles.detailValue, styles.pointsValue, { color: colors.primary }]}>
                    {user.xp_points.toLocaleString()} XP
                  </Text>
                </View>

                {/* Best Streak */}
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    {t('BestStreak')}
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {user.best_streak || 0} {t('lessons')}
                  </Text>
                </View>
              </View>

              {/* Start Chat Button */}
              {canStartChat && (
                <View style={styles.chatButtonContainer}>
                  <Pressable
                    style={[styles.chatButton, { backgroundColor: colors.primary }]}
                    onPress={handleStartChat}
                  >
                    <MessageCircle size={20} color="#fff" />
                    <Text style={styles.chatButtonText}>Начать чат</Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  loadingText: {
    fontSize: 15,
    textAlign: 'center',
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
  statusDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    marginRight: 4,
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
  modalStatusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    borderWidth: 3,
    borderColor: '#ffffff',
    borderRadius: 10,
  },
  chatButtonContainer: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});