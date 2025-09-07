// components/LeaderboardItem.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Platform } from 'react-native';
import { Crown, Award, Star } from 'lucide-react-native';

type LeaderboardUser = {
  id: string;
  username: string;
  description: string;
  avatar_url: string;
  xp_points: number;
  status?: 'online' | 'offline';
  last_seen?: string | null;
  best_streak: number;
  rank?: number;
};

interface LeaderboardItemProps {
  item: LeaderboardUser;
  colors: any;
  onPress: (user: LeaderboardUser) => void;
}

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

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ item, colors, onPress }) => {
  return (
    <Pressable 
      style={[
        styles.leaderboardItem,
        { backgroundColor: colors.card, borderColor: colors.border },
        item.rank === 1 && styles.firstPlace,
        item.rank === 2 && styles.secondPlace,
        item.rank === 3 && styles.thirdPlace,
      ]}
      onPress={() => onPress(item)}
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
};

const styles = StyleSheet.create({
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
});