import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Получаем начальную сессию
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('[useAuth] Начальная сессия:', session?.user?.id || 'нет');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Подписываемся на изменения авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] Auth state change:', event, session?.user?.id || 'нет пользователя');
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Если пользователь вошел и мы на callback странице, перенаправляем
        if (event === 'SIGNED_IN' && session?.user) {
          const provider = session.user.app_metadata?.provider;
          
          if (provider === 'google') {
            console.log('[useAuth] Google OAuth вход обнаружен');
          }
          
          // Перенаправляем с callback страницы
          if (typeof window !== 'undefined' && window.location.pathname === '/auth/callback') {
            console.log('[useAuth] Перенаправляем с callback страницы на /profile');
            setTimeout(() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/profile';
              }
            }, 1000);
          }
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return {
    session,
    loading,
    user,
  };
}