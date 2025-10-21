import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfileData } from '@/hooks/useProfileData';
import { useProfileActions } from '@/hooks/useProfileActions';
import { router } from 'expo-router';

// Components
import ProfileHeader from '@/components/profile_components/ProfileHeader';
import ProfileCard from '@/components/profile_components/ProfileCard';
import StatsContainer from '@/components/profile_components/StatsContainer';
import AchievementsList from '@/components/profile_components/AchievementsList';
import StudiedWordsList from '@/components/profile_components/StudiedWordsList';
import AccountActions from '@/components/profile_components/AccountActions';
import SettingsModal from '@/components/profile_components/SettingsModal';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { t, colors } = useLanguage();
  
  // State
  const [showSettings, setShowSettings] = useState(false);
  const [editingUsername, setEditingUsername] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  // Custom hooks
  const {
    profile,
    setProfile,
    userProgress,
    levels,
    userStatus,
    lastSeen,
    loading,
    error: dataError,
    loadData,
  } = useProfileData(user?.id, t);

  const {
    loading: actionLoading,
    error: actionError,
    success,
    pickImage,
    pickBackgroundImage,
    updateProfile,
    handleSignOut,
    handleChangePassword,
    setError,
  } = useProfileActions(user?.id, loadData);

  // Set initial editing values when profile loads
  React.useEffect(() => {
    if (profile) {
      setEditingUsername(profile.username || '');
      setEditingDescription(profile.description || '');
    }
  }, [profile]);

  const completedLevels = userProgress.filter(progress => progress.completed).length;
  const completedLevelIds = userProgress.filter(progress => progress.completed).map(progress => progress.level_id);
  const error = dataError || actionError;

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ProfileHeader onSettingsPress={() => setShowSettings(true)} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>{t('loading')}</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>{t('retry')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        <ProfileHeader onSettingsPress={() => setShowSettings(true)} />

        <ProfileCard
          profile={profile}
          userStatus={userStatus}
          lastSeen={lastSeen}
          editingUsername={editingUsername}
          setEditingUsername={setEditingUsername}
          editingDescription={editingDescription}
          setEditingDescription={setEditingDescription}
          onUsernameUpdate={(username) => updateProfile({ username })}
          onDescriptionUpdate={(description) => updateProfile({ description })}
          onPickImage={pickImage}
          onPickBackgroundImage={pickBackgroundImage}
          error={error}
          success={success}
        />

        <StatsContainer 
          completedLevels={completedLevels}
          bestStreak={profile?.best_streak || 0}
        />

        <AchievementsList 
          userProgress={userProgress}
          levels={levels}
        />

        <StudiedWordsList 
          completedLevels={completedLevelIds}
          colors={colors}
          t={t}
        />

        <AccountActions
          onChangePassword={handleChangePassword}
          onSignOut={handleSignOut}
          onChatsPress={() => router.push('/personal-chats')}
        />

        <SettingsModal
          visible={showSettings}
          onClose={() => setShowSettings(false)}
          wantChats={profile?.want_chats || false}
          onWantChatsChange={(value) => {
            if (profile) {
              setProfile({ ...profile, want_chats: value });
            }
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.select({ 
      ios: 120, 
      android: 120, 
      default: 32 
    }),
  },
  errorText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});