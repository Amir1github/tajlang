import { useState, useEffect } from 'react';
import { supabase, type Profile, type UserProgress, type Level, getUserStatus, updateUserStatus, setupStatusTracking } from '@/lib/supabase';

interface UseProfileDataReturn {
  profile: Profile | null;
  userProgress: UserProgress[];
  levels: Record<string, Level>;
  userStatus: 'online' | 'offline';
  lastSeen: string | null;
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
}

export function useProfileData(userId: string | undefined, t: (key: string) => string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [levels, setLevels] = useState<Record<string, Level>>({});
  const [userStatus, setUserStatus] = useState<'online' | 'offline'>('offline');
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadData();
      setupUserStatus();
    }
  }, [userId]);

  async function setupUserStatus() {
    if (!userId) return;

    // Set up status tracking
    const { startTracking } = setupStatusTracking(userId);
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
    if (!userId) return;

    try {
      const { status, lastSeen, error } = await getUserStatus(userId);
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
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, description, avatar_url, background_image, xp_points, current_streak, best_streak, last_completed_at, created_at, updated_at, status, last_seen, want_chats')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
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
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setUserProgress(data || []);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  return {
    profile,
    setProfile,
    userProgress,
    levels,
    userStatus,
    lastSeen,
    loading,
    error,
    loadData,
  };
}