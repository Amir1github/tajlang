import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function OAuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[OAuthCallback] useEffect стартовал');
    console.log('[OAuthCallback] Current URL:', window.location.href);
    
    const handleCallback = async () => {
      try {
        // Проверяем, есть ли токены в URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          console.log('[OAuthCallback] Найден access_token, устанавливаем сессию');
          const refreshToken = hashParams.get('refresh_token');
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('[OAuthCallback] Ошибка установки сессии:', error);
            throw error;
          }

          if (data?.user) {
            console.log('[OAuthCallback] Сессия установлена для пользователя:', data.user.id);
            // useAuth автоматически обработает этого пользователя и перенаправит
            // Просто ждем
            router.push('/');
            return;
          }
        }

        // Если токенов нет, проверяем текущую сессию
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('[OAuthCallback] Найдена существующая сессия, перенаправляем');
          router.replace('/profile');
          return;
        }

        // Если ничего не найдено, возвращаемся к входу
        console.log('[OAuthCallback] Сессия не найдена, возвращаемся к входу');
        setError('Не удалось завершить авторизацию');
        setTimeout(() => {
          router.replace('/auth/sign-in');
        }, 2000);

      } catch (err) {
        console.error('[OAuthCallback] Ошибка:', err);
        setError('Произошла ошибка при авторизации');
        setTimeout(() => {
          router.replace('/auth/sign-in');
        }, 2000);
      } finally {
        // Убираем loading через 5 секунд в любом случае
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      }
    };

    handleCallback();

    // Подписка на изменения auth состояния для отслеживания успешной авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[OAuthCallback] Auth state change:', event, session?.user?.id || 'нет');
        
        // Если пользователь вошел и мы все еще на callback странице, перенаправляем
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('[OAuthCallback] Пользователь вошел, перенаправляем через 1 сек');
          setTimeout(() => {
            router.replace('/profile');
          }, 1000);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.text}>Завершаем авторизацию...</Text>
        <Text style={styles.subText}>Это может занять несколько секунд</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.subText}>Перенаправляем обратно...</Text>
      </View>
    );
  }

  return null;
}

  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 8,
  },
});