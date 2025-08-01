import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Modal, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Link, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { User, Mail, Lock, AlertCircle, Shield } from 'lucide-react-native';
import * as EmailJS from '@emailjs/browser';

// Initialize EmailJS
EmailJS.init(process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY!); // Your public key
const EXPO_PUBLIC_EMAILJS_SERVICE_ID = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID!;
const EXPO_PUBLIC_EMAILJS_TEMPLATE_ID = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EXPO_PUBLIC_EMAILJS_PUBLIC_KEY = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY!;

const { height, width } = Dimensions.get('window');

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [loadingVerification, setLoadingVerification] = useState(false);

  const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const validateFormForEmail = () => {
    if (!username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  async function createProfileIfNotExists(userId: string, userUsername: string, userEmail?: string, avatarUrl?: string) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (!profileData) {
      const { error: insertError } = await supabase.from('profiles').insert([
        {
          id: userId,
          username: userUsername,
          avatar_url: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userUsername}`
        },
      ]);

      if (insertError) {
        throw insertError;
      }
    }
  }

  async function handleOAuthSignUp(provider: 'google') {
  try {
    setLoading(true);
    setError(null);

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'https://ywkrnufwzfkzuokhkuzc.supabase.co/auth/v1/callback',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    // Не нужно обрабатывать user/session здесь!
    // Supabase сам сделает редирект на /auth/callback
    // Вся логика создания профиля и router.replace('/profile') должна быть в callback.tsx

  } catch (error: any) {
    setError(error.message || 'Failed to sign in with Google');
  } finally {
    setLoading(false);
  }
}
  async function sendVerificationEmail() {
    const code = generateRandomCode();
    setSentCode(code);

    const templateParams = {
      email: email.trim(),
      from_name: 'Tajlang',
      code: code,
    };

    try {
      const result = await EmailJS.send(
        EXPO_PUBLIC_EMAILJS_SERVICE_ID,
        EXPO_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        EXPO_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      console.log('Email sent successfully', result.status);
      return true;
    } catch (error) {
      console.error('EmailJS error:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async function handleEmailSignUp() {
    if (!validateFormForEmail()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const emailSent = await sendVerificationEmail();
      if (emailSent) {
        setShowVerificationModal(true);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  }

  async function verifyAndSignUp() {
    if (!sentCode || verificationCode !== sentCode) {
      setError('Invalid verification code');
      return;
    }

    try {
      setLoadingVerification(true);
      setError(null);

      // Try to create new user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim(),
          },
        },
      });

      if (signUpError) {
        // If error "User already registered", try to sign in
        if (signUpError.message.includes('User already registered')) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

          if (signInError) {
            throw signInError;
          }

          const { user } = signInData;

          if (user) {
            await createProfileIfNotExists(user.id, username.trim(), user.email);
            router.replace('/profile');
          }
          return;
        } else {
          throw signUpError;
        }
      }

      const { user } = data;

      if (user) {
        await createProfileIfNotExists(user.id, username.trim(), user.email);
        router.replace('/profile');
      }

      setShowVerificationModal(false);
    } catch (error: any) {
      console.error(error);
      setError(error.message || 'Failed to create account');
    } finally {
      setLoadingVerification(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(800)} style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.subtitle}>Join Tajlang and start your learning journey</Text>
          </View>

          {error && (
            <Animated.View entering={FadeInDown.delay(200)} style={styles.errorContainer}>
              <AlertCircle size={20} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          )}

          {/* Google OAuth Button */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.oauthContainer}>
            <Pressable
              style={[styles.oauthButton, styles.googleButton]}
              onPress={() => handleOAuthSignUp('google')}
              disabled={loading}
            >
              <FontAwesome name="google" size={20} color="#374151" />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400)} style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </Animated.View>

          {/* Form Fields */}
          <Animated.View entering={FadeInUp.delay(500)} style={styles.formFields}>
            <View style={styles.inputContainer}>
              <User size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#9ca3af"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password (min 6 characters)"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </Animated.View>

          {/* Email Sign Up Button */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.buttonContainer}>
            <Pressable
              style={[styles.signUpButton, loading && styles.buttonDisabled]}
              onPress={handleEmailSignUp}
              disabled={loading}
            >
              <Text style={styles.signUpButtonText}>
                {loading ? 'Sending code...' : 'Sign Up with Email'}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Sign In Link */}
          <Animated.View entering={FadeInUp.delay(700)} style={styles.linkContainer}>
            <Link href="/auth/sign-in">
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkHighlight}>Sign in</Text>
              </Text>
            </Link>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {/* Verification Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showVerificationModal}
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInUp.duration(300)} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Shield size={48} color="#3b82f6" />
              <Text style={styles.modalTitle}>Verify Your Email</Text>
              <Text style={styles.modalSubtitle}>
                We've sent a verification code to {email}. Please enter it below:
              </Text>
            </View>

            <View style={styles.codeInputContainer}>
              <TextInput
                style={styles.codeInput}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#9ca3af"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalCancelButton}
                onPress={() => setShowVerificationModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.modalVerifyButton}
                onPress={verifyAndSignUp}
                disabled={loadingVerification}
              >
                {loadingVerification ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalVerifyText}>Verify</Text>
                )}
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  formContainer: {
    maxWidth: 380,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  oauthContainer: {
    gap: 12,
    marginBottom: 24,
  },
  oauthButton: {
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    backgroundColor: '#ffffff',
  },
  googleButton: {
    borderColor: '#e5e7eb',
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  formFields: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  signUpButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '500',
  },
  linkHighlight: {
    color: '#3b82f6',
    fontSize: 15,
    fontWeight: '700',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 24,
  },
  codeInput: {
    flex: 1,
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '600',
    letterSpacing: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modalCancelText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  modalVerifyButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalVerifyText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});