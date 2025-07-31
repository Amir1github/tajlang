import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  async function handleChangePassword() {
    try {
      if (password !== confirmPassword) {
        setError(t('passwordsDoNotMatch'));
        return;
      }

      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      router.push('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Animated.Text entering={FadeInDown.duration(500)} style={styles.title}>
        {t('changePassword')}
      </Animated.Text>

      {error && (
        <Animated.Text entering={FadeInDown.delay(200)} style={styles.error}>
          {error}
        </Animated.Text>
      )}

      <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={t('newPassword')}
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={t('confirmPassword')}
          placeholderTextColor="#9ca3af"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600)} style={styles.buttonWrapper}>
        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? t('changing') : t('changePassword')}
          </Text>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(700)} style={styles.buttonWrapper}>
        <Pressable
          style={[styles.cancelButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
        </Pressable>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#111827',
  },
  inputWrapper: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  input: {
    padding: 14,
    fontSize: 16,
    color: '#111827',
  },
  buttonWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 12,
  },
});