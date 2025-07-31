import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      router.replace('/profile');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setOauthLoading(true);
      setError(null);

      const redirectUrl = Platform.OS === 'web' 
        ? `${window.location.origin}/auth/callback`
        : 'tajlang://auth-callback';

      console.log('Using redirect URL:', redirectUrl);

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
          skipBrowserRedirect: false,
        },
      });

      if (oauthError) throw oauthError;

      // The redirect will happen automatically for web
      // No need to handle auth state changes here for web OAuth

    } catch (error: any) {
      console.error('Google OAuth error:', error);
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setOauthLoading(false);
    }
  }

  async function handleOAuthSuccess(user: any) {
    try {
      // Check if profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profileData) {
        // Create new profile
        const username = user.user_metadata?.full_name || 
                        user.email?.split('@')[0] || 
                        `user${Math.floor(Math.random() * 1000)}`;
        
        const avatarUrl = user.user_metadata?.avatar_url || 
                         `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            username,
            avatar_url: avatarUrl,
            email: user.email,
            full_name: user.user_metadata?.full_name || username,
          }]);

        if (insertError) {
          console.error('Profile creation error:', insertError);
          // Don't throw error, profile might already exist
        }
      }

      router.replace('/profile');
    } catch (error) {
      console.error('Error handling OAuth success:', error);
      // Still redirect to profile, as auth was successful
      router.replace('/profile');
    }
  }

  return (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    style={styles.container}
  >
    <View style={styles.content}>
      <Image
        source={require('@/assets/images/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Animated.Text entering={FadeInDown.duration(500)} style={styles.title}>
        Welcome Back 👋
      </Animated.Text>

      {error && (
        <Animated.View entering={FadeInDown.delay(200)} style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={16} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}

      <Animated.View entering={FadeInUp.delay(200)} style={styles.oauthContainer}>
        <Pressable
          style={[styles.googleButton, oauthLoading && styles.buttonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={oauthLoading || loading}
        >
          {oauthLoading ? (
            <ActivityIndicator color="#4285f4" size="small" />
          ) : (
            <FontAwesome name="google" size={18} color="#4285f4" />
          )}
          <Text style={styles.googleButtonText}>
            {oauthLoading ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300)} style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400)} style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(500)} style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600)} style={styles.buttonWrapper}>
        <Pressable
          style={[styles.button, (loading || oauthLoading) && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading || oauthLoading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(700)} style={styles.linkWrapper}>
        <Link href="/auth/sign-up">
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkHighlight}>Sign up</Text>
          </Text>
        </Link>
      </Animated.View>
    </View>
  </KeyboardAvoidingView>
);

}

const styles = StyleSheet.create({
  content: {
  width: '90%',
  maxWidth: 360,
  alignItems: 'center',
},

  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius: 16,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#111827',
    alignSelf: 'center',
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
    width: '100%',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  oauthContainer: {
    width: '100%',
    marginBottom: 20,
  },
  googleButton: {
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
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
    marginVertical: 20,
    width: '100%',
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
    backgroundColor: '#f9fafb',
  },
  inputWrapper: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
  },
  input: {
    padding: 14,
    fontSize: 16,
    color: '#111827',
  },
  buttonWrapper: {
    marginTop: 8,
    marginBottom: 16,
    width: '100%',
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
  linkWrapper: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#6b7280',
  },
  linkHighlight: {
    color: '#4f46e5',
    fontWeight: '600',
  },
});