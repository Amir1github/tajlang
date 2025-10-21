import { useState } from 'react';
import { Platform } from 'react-native';
import { supabase, type Profile, updateUserStatus } from '@/lib/supabase';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'
export function useProfileActions(userId: string | undefined, onProfileUpdate: () => Promise<void>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadImage = async (file: File | Blob, bucket: 'avatars' | 'backgrounds' = 'avatars') => {
    try {
      const fileExt = 'jpg';
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
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
              const uploadedUrl = await uploadImage(file, 'avatars');
              await updateProfile({ avatar_url: uploadedUrl });
              await onProfileUpdate();
            } catch (error) {
              console.error('Error uploading image:', error);
              setError('Failed to upload image');
            }
          }
        };
        
        input.click();
      } else {
        
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });

        if (!result.canceled) {
          const response = await fetch(result.assets[0].uri);
          const blob = await response.blob();
          const uploadedUrl = await uploadImage(blob, 'avatars');
          await updateProfile({ avatar_url: uploadedUrl });
          await onProfileUpdate();
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setError('Failed to update profile picture');
    }
  };

  const pickBackgroundImage = async () => {
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
              const uploadedUrl = await uploadImage(file, 'backgrounds');
              await updateProfile({ background_image: uploadedUrl });
              await onProfileUpdate();
            } catch (error) {
              console.error('Error uploading background image:', error);
              setError('Failed to upload background image');
            }
          }
        };
        
        input.click();
      } else {
        
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [16, 9],
          quality: 0.7,
        });

        if (!result.canceled) {
          const response = await fetch(result.assets[0].uri);
          const blob = await response.blob();
          const uploadedUrl = await uploadImage(blob, 'backgrounds');
          await updateProfile({ background_image: uploadedUrl });
          await onProfileUpdate();
        }
      }
    } catch (error) {
      console.error('Error picking background image:', error);
      setError('Failed to update background image');
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!userId) return;
    
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
        .eq('id', userId);

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

  const handleSignOut = async () => {
    if (userId) {
      await updateUserStatus(userId, 'offline');
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

  return {
    loading,
    error,
    success,
    pickImage,
    pickBackgroundImage,
    updateProfile,
    handleSignOut,
    handleChangePassword,
    setError,
  };
}