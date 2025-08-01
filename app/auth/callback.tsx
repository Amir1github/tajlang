import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

async function createUserProfile(user: any) {
  if (!user.email) {
    throw new Error('Google did not return email. Cannot create profile.');
  }

  const username = user.user_metadata?.full_name?.trim() ||
    user.email?.split('@')[0]?.trim() ||
    `user_${Math.random().toString(36).substring(2, 8)}`;

  const avatarUrl = user.user_metadata?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  const { error: upsertError } = await supabase.from('profiles').upsert({
    id: user.id,
    username,
    email: user.email,
    full_name: user.user_metadata?.full_name || username,
    avatar_url: avatarUrl,
  });

  if (upsertError) {
    console.error('Profile upsert error:', upsertError);
    throw upsertError;
  }

  // Проверяем, что профиль действительно создан
  const { data: profile, error: selectError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (selectError || !profile) {
    console.error('Profile select error:', selectError);
    throw selectError || new Error('Profile not created');
  }
}

export default function OAuthCallback() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Supabase getUser error:', userError);
        router.replace('/auth/sign-in');
        setLoading(false);
        return;
      }
      if (user) {
        try {
          await createUserProfile(user);
          router.replace('/profile');
        } catch (error) {
          console.error('Profile creation error:', error);
          router.replace('/auth/sign-in');
        } finally {
          setLoading(false);
        }
      } else {
        router.replace('/auth/sign-in');
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}