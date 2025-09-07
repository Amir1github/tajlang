import { View, Text, StyleSheet, Image, Pressable, ScrollView, TextInput, Modal, Platform } from 'react-native';
import { Settings, Award, Flame, LogOut, Lock, Moon, Sun, Circle } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase, type Profile, type UserProgress, type Level, getUserStatus, updateUserStatus, setupStatusTracking } from '@/lib/supabase';
import { useLanguage, lightTheme, darkTheme } from '@/contexts/LanguageContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { t, language, setLanguage, theme, setTheme, colors } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [levels, setLevels] = useState<Record<string, Level>>({});
  const [userStatus, setUserStatus] = useState<'online' | 'offline'>('offline');
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [editingUsername, setEditingUsername] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
      setupUserStatus();
    }
  }, [user]);
  async function setupUserStatus() {
    if (!user) return;

    // Set up status tracking
    const { startTracking } = setupStatusTracking(user.id);
    const cleanup = startTracking();

    // Get initial status
    await fetchUserStatus();

    // Set up periodic status checks
    const statusInterval = setInterval(fetchUserStatus, 30000); // Check every 30 seconds

    return () => {
      cleanup();
      clearInterval(statusInterval);
    };
  }
  async function fetchUserStatus() {
    if (!user) return;

    try {
      const { status, lastSeen, error } = await getUserStatus(user.id);
      if (!error) {
        setUserStatus(status);
        setLastSeen(lastSeen || null);
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  }

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchProfile(),
        fetchUserProgress(),
        fetchLevels()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, description, avatar_url, xp_points, current_streak, best_streak, last_completed_at, created_at, updated_at, status, last_seen')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setEditingUsername(data?.username || '');
      setEditingDescription(data?.description || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  async function fetchLevels() {
    try {
      const { data, error } = await supabase
        .from('levels')
        .select('*')
        .order('order_number');

      if (error) throw error;
      
      const levelMap = (data || []).reduce((acc, level) => {
        acc[level.id] = level;
        return acc;
      }, {} as Record<string, Level>);
      
      setLevels(levelMap);
    } catch (error) {
      console.error('Error fetching levels:', error);
      throw error;
    }
  }

  async function fetchUserProgress() {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserProgress(data || []);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  const handleSignOut = async () => {
    if (user) {
      await updateUserStatus(user.id, 'offline');
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/auth/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
    }
  };

  const handleChangePassword = () => {
    router.push('/auth/change-password');
  };

  const uploadImage = async (file: File | Blob) => {
    try {
      const fileExt = 'jpg';
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      setError(null);
      
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e: Event) => {
          const target = e.target as HTMLInputElement;
          const file = target.files?.[0];
          
          if (file) {
            try {
              const uploadedUrl = await uploadImage(file);
              await updateProfile({ avatar_url: uploadedUrl });
              await fetchProfile();
            } catch (error) {
              console.error('Error uploading image:', error);
              setError('Failed to upload image');
            }
          }
        };
        
        input.click();
      } else {
        const ImagePicker = await import('expo-image-picker');
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });

        if (!result.canceled) {
          const response = await fetch(result.assets[0].uri);
          const blob = await response.blob();
          const uploadedUrl = await uploadImage(blob);
          await updateProfile({ avatar_url: uploadedUrl });
          await fetchProfile();
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setError('Failed to update profile picture');
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
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

  const completedLevels = userProgress.filter(progress => progress.completed).length;

  const stats = [
    {
      icon: <Award size={24} color="#6366f1" />,
      label: t('levelsCompleted'),
      value: completedLevels.toString(),
    },
    {
      icon: <Flame size={24} color="#6366f1" />,
      label: t('bestStreak'),
      value: profile?.best_streak?.toString() || '0',
    },
  ];

  const defaultAvatarUrl = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&q=80&fit=crop';

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.headerContainer}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.headerIcon} 
            resizeMode="contain"
          />
          <Text style={styles.header}>{t('profile')}</Text>
        </View>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>{t('loading')}</Text>
      </View>
    );
  }

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
       <View style={styles.headerContainer}>
  <Image 
    source={require('@/assets/images/icon.png')} 
    style={styles.headerIcon} 
    resizeMode="contain"
  />
  <View style={styles.headerTextContainer}>
    <Text style={[styles.header, { color: colors.text }]}>{t('profile')}</Text>
    <Text style={[styles.subHeader, { color: colors.textSecondary }]}>
      {t('profile_description')}
    </Text>
  </View>
  <Pressable 
    style={styles.settingsButton}
    onPress={() => setShowSettings(true)}
  >
    <Settings size={24} color={colors.textSecondary} />
  </Pressable>
</View>


        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pressable onPress={pickImage}>
            <Image
              source={{ 
                uri: profile?.avatar_url || defaultAvatarUrl 
              }}
              style={styles.avatar}
              onError={() => setImageError(true)}
            />
            <Text style={[styles.changePhotoText, { color: colors.primary }]}>{t('changePhoto')}</Text>
          </Pressable>
          
          <View style={styles.usernameContainer}>
            <TextInput
              style={[styles.usernameInput, { color: colors.text }]}
              value={editingUsername}
              onChangeText={setEditingUsername}
              onBlur={() => {
                if (editingUsername !== profile?.username) {
                  updateProfile({ username: editingUsername });
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
                  updateProfile({ description: editingDescription });
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

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {stat.icon}
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.achievementsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('recentAchievements')}</Text>
          {userProgress.filter(p => p.completed).slice(0, 3).map((progress, index) => {
            const level = levels[progress.level_id];
            return (
              <View key={index} style={[styles.achievement, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Award size={24} color={colors.primary} />
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle, {color: colors.primary}}>
                    {level ? `${level.title} ${t('completed')}` : t('levelCompleted')}
                  </Text>
                  <Text style={[styles.achievementDate, { color: colors.textSecondary }]}>
                    {t('points')}: {progress.score}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.accountActions}>
          <Pressable
            style={[styles.actionButton, styles.changePasswordButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
            onPress={handleChangePassword}
          >
            <Lock size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>{t('changePassword')}</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.signOutButton, { backgroundColor: colors.card, borderColor: colors.error }]}
            onPress={handleSignOut}
          >
            <LogOut size={20} color={colors.error} />
            <Text style={[styles.actionButtonText, { color: colors.error }]}>{t('signOut')}</Text>
          </Pressable>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={showSettings}
          onRequestClose={() => setShowSettings(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{t('settings')}</Text>
                <Pressable onPress={() => setShowSettings(false)} style={styles.closeButton}>
                  <Text style={{ color: colors.textSecondary }}>✕</Text>
                </Pressable>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('language')}</Text>
                <View style={styles.languageOptions}>
                  <Pressable
                    style={[
                      styles.languageOption, 
                      { borderColor: colors.border },
                      language === 'en' && styles.languageOptionActive,
                      language === 'en' && { backgroundColor: colors.secondary, borderColor: colors.primary },
                    ]}
                    onPress={() => setLanguage('en')}
                  >
                    <Text
                      style={[
                        styles.languageText, 
                        { color: colors.textSecondary },
                        language === 'en' && { color: colors.primary, fontWeight: '600' },
                      ]}
                    >
                      English
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.languageOption, 
                      { borderColor: colors.border },
                      language === 'ru' && styles.languageOptionActive,
                      language === 'ru' && { backgroundColor: colors.secondary, borderColor: colors.primary },
                    ]}
                    onPress={() => setLanguage('ru')}
                  >
                    <Text
                      style={[
                        styles.languageText, 
                        { color: colors.textSecondary },
                        language === 'ru' && { color: colors.primary, fontWeight: '600' },
                      ]}
                    >
                      Русский
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('theme')}</Text>
                <View style={styles.languageOptions}>
                  <Pressable
                    style={[
                      styles.languageOption, 
                      { borderColor: colors.border },
                      theme === 'light' && styles.languageOptionActive,
                      theme === 'light' && { backgroundColor: colors.secondary, borderColor: colors.primary },
                    ]}
                    onPress={() => setTheme('light')}
                  >
                    <Sun size={20} color={theme === 'light' ? colors.primary : colors.textSecondary} />
                    <Text
                      style={[
                        styles.languageText, 
                        { color: colors.textSecondary },
                        theme === 'light' && { color: colors.primary, fontWeight: '600' },
                      ]}
                    >
                      {t('lightMode')}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.languageOption, 
                      { borderColor: colors.border },
                      theme === 'dark' && styles.languageOptionActive,
                      theme === 'dark' && { backgroundColor: colors.secondary, borderColor: colors.primary },
                    ]}
                    onPress={() => setTheme('dark')}
                  >
                    <Moon size={20} color={theme === 'dark' ? colors.primary : colors.textSecondary} />
                    <Text
                      style={[
                        styles.languageText, 
                        { color: colors.textSecondary },
                        theme === 'dark' && { color: colors.primary, fontWeight: '600' },
                      ]}
                    >
                      {t('darkMode')}
                    </Text>
                  </Pressable>
                </View>
                
              </View>
              <View style={styles.footerLinks}>
        <Pressable 
          onPress={() => {
            setShowSettings(false);
            router.push('/privacy-policy');
          }}
          style={styles.footerLink}
        >
          <Text style={[styles.footerLinkText, { color: colors.primary }]}>
            {t('privacyPolicy')}
          </Text>
        </Pressable>
        
        <Text style={{ color: colors.textSecondary }}> • </Text>
        
        <Pressable 
          onPress={() => {
            setShowSettings(false);
            router.push('/our-team');
          }}
          style={styles.footerLink}
        >
          <Text style={[styles.footerLinkText, { color: colors.primary }]}>
            {t('ourTeam')}
          </Text>
        </Pressable>
      </View>
            </View>
            
          </View>
          
        </Modal>
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
  headerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 24,
  paddingTop: Platform.select({ ios: 8, android: 16, default: 0 }),
},
headerIcon: {
  width: Platform.select({ web: 56, default: 64 }),
  height: Platform.select({ web: 56, default: 64 }),
},
headerTextContainer: {
  flex: 1,
  marginLeft: 12,
},
header: {
  fontSize: Platform.select({ web: 28, default: 32 }),
  fontWeight: 'bold',
},
subHeader: {
  fontSize: Platform.select({ web: 14, default: 16 }),
  marginTop: 4,
},

  settingsButton: {
    padding: 8,
  },
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
  achievementsContainer: {
    marginTop: 24,
    gap: 12,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  footerLinks: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
  paddingTop: 16,
  borderTopWidth: 1
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
footerLink: {
  paddingHorizontal: 8,
  paddingVertical: 4,
},
footerLinkText: {
  fontSize: 14,
  fontWeight: '500',
},
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
      },
    }),
    borderWidth: 1,
  },
  achievementInfo: {
    marginLeft: 12,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  achievementDate: {
    fontSize: 14,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  languageOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  languageText: {
    fontSize: 16,
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
  accountActions: {
    marginTop: 32,
    gap: 16,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    marginBottom: Platform.select({ 
      ios: 32, 
      android: 32, 
      default: 32 
    }),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});