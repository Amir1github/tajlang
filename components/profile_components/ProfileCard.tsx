import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TextInput, Platform } from 'react-native';
import { Flame, Circle } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Profile } from '@/lib/supabase';

interface ProfileCardProps {
  profile: Profile | null;
  userStatus: 'online' | 'offline';
  lastSeen: string | null;
  editingUsername: string;
  setEditingUsername: (value: string) => void;
  editingDescription: string;
  setEditingDescription: (value: string) => void;
  onUsernameUpdate: (username: string) => void;
  onDescriptionUpdate: (description: string) => void;
  onPickImage: () => void;
  error: string | null;
  success: boolean;
}

export default function ProfileCard({
  profile,
  userStatus,
  lastSeen,
  editingUsername,
  setEditingUsername,
  editingDescription,
  setEditingDescription,
  onUsernameUpdate,
  onDescriptionUpdate,
  onPickImage,
  error,
  success,
}: ProfileCardProps) {
  const { t, colors } = useLanguage();

  const getStatusColor = (status: 'online' | 'offline') => {
    return status === 'online' ? '#22c55e' : '#6b7280';
  };

  const getStatusText = (status: 'online' | 'offline', lastSeen?: string | null) => {
    if (status === 'online') {
      return t('online');
    }
    
    if (lastSeen) {
      const lastSeenDate = new Date(lastSeen);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 60) {
        return `${t('lastSeen')} ${diffInMinutes}${t('minutesAgo')}`;
      } else if (diffInMinutes < 1440) { // 24 hours
        const hours = Math.floor(diffInMinutes / 60);
        return `${t('lastSeen')} ${hours}${t('hoursAgo')}`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `${t('lastSeen')} ${days}${t('daysAgo')}`;
      }
    }
    
    return t('offline');
  };

  const defaultAvatarUrl = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&q=80&fit=crop';

  return (
    <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Pressable onPress={onPickImage}>
        <Image
          source={{ 
            uri: profile?.avatar_url || defaultAvatarUrl 
          }}
          style={styles.avatar}
        />
        <Text style={[styles.changePhotoText, { color: colors.primary }]}>
          {t('changePhoto')}
        </Text>
      </Pressable>
      
      <View style={styles.usernameContainer}>
        <TextInput
          style={[styles.usernameInput, { color: colors.text }]}
          value={editingUsername}
          onChangeText={setEditingUsername}
          onBlur={() => {
            if (editingUsername !== profile?.username) {
              onUsernameUpdate(editingUsername);
            }
          }}
          placeholder={t('enterUsername')}
          placeholderTextColor={colors.textTertiary}
        />
        
        <View style={styles.statusContainer}>
          <Circle 
            size={8} 
            color={getStatusColor(userStatus)} 
            fill={getStatusColor(userStatus)}
            style={styles.statusDot}
          />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            {getStatusText(userStatus, lastSeen)}
          </Text>
        </View>
        
        <TextInput
          style={[styles.descriptionInput, { color: colors.textSecondary, borderColor: colors.border }]}
          value={editingDescription}
          onChangeText={setEditingDescription}
          onBlur={() => {
            if (editingDescription !== profile?.description) {
              onDescriptionUpdate(editingDescription);
            }
          }}
          placeholder={t('enterDescription')}
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          maxLength={200}
        />
        
        <Text style={[styles.pointsText, { color: colors.text }]}>
          {profile?.xp_points || 0} {t('points')}
        </Text>
      </View>
      
      <View style={styles.streakContainer}>
        <Flame size={24} color={colors.primary} />
        <Text style={styles.streakText}>
          {t('currentStreak')}: {profile?.current_streak || 0} {t('days')}
        </Text>
      </View>

      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
      {success && <Text style={[styles.successText, { color: colors.success }]}>{t('profileUpdated')}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      },
    }),
    borderWidth: Platform.select({ web: 0, default: 1 }),
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#e2e8f0',
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  usernameContainer: {
    width: '100%',
    marginBottom: 8,
    alignItems: 'center',
  },
  usernameInput: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    padding: 8,
    width: '100%',
    maxWidth: 400,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  statusDot: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionInput: {
    fontSize: 16,
    textAlign: 'center',
    padding: 12,
    width: '100%',
    maxWidth: 400,
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  streakText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  errorText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  successText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
  },
});