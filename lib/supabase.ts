import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Profile = {
  id: string;
  username: string;
  description: string;
  avatar_url: string | null;
  xp_points: number;
  current_streak: number;
  best_streak: number;
  last_completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Level = {
  id: string;
  title: string;
  en_title?: string;
  ru_title?: string;
  ru_description?: string;
  description: string;
  order_number: number;
  points_value: number;
  created_at: string;
  updated_at: string;
};

export type Word = {
  id: string;
  level_id: string;
  ru_explanation: string;
  russian: string;
  tajik: string;
  english: string;
  explanation: string;
  examples: string[];
  created_at: string;
  updated_at: string;
};

export type QuestionType = 'multiple_choice' | 'fill_in_blank';

export type Question = {
  id: string;
  level_id: string;
  question_text: string;
  correct_answer: string;
  options: string[];
  type: QuestionType;
  hint?: string;
  alternative_answers?: string[];
  created_at: string;
  updated_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  level_id: string;
  completed: boolean;
  score: number;
  score_ratio: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  created_at: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  created_at: string;
  achievement?: Achievement;
};

export async function updateUserProgress(
  userId: string,
  levelId: string,
  score: number,
  completed: boolean
): Promise<{ error: Error | null }> {
  try {
    // Получаем текущую информацию о пользователе
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('last_completed_at, current_streak, best_streak')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    const now = new Date();
    const lastCompleted = profile.last_completed_at ? new Date(profile.last_completed_at) : null;

    // Определяем новые значения для streak
    let newStreak = 0; // По умолчанию обнуляем при неудаче
    let newBestStreak = profile.best_streak || 0;

    if (completed) {
      // Проверяем, был ли последний успех в течение последних 24 часов
      const within24Hours = lastCompleted && 
        Math.floor((now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24)) <= 1;

      // Если есть предыдущее завершение и оно было в течение 24 часов, увеличиваем streak
      // Иначе начинаем новую серию с 1
      newStreak = within24Hours ? profile.current_streak + 1 : 1;
      
      // Обновляем лучший streak если текущий его превысил
      if (newStreak > newBestStreak) {
        newBestStreak = newStreak;
      }
    }

    const completedAt = completed ? now.toISOString() : null;
    const lastCompletedAt = completed ? now.toISOString() : profile.last_completed_at;

    // Обновляем прогресс и очки через RPC
    const { error: updateError } = await supabase.rpc('update_user_progress_and_points', {
      p_user_id: userId,
      p_level_id: levelId,
      p_completed: completed,
      p_score: Math.round(score * 100),
      p_score_ratio: score,
      p_completed_at: completedAt,
      p_current_streak: newStreak,
      p_best_streak: newBestStreak,
      p_last_completed_at: lastCompletedAt
    });

    if (updateError) throw updateError;

    return { error: null };
  } catch (error) {
    console.error('Error updating user progress:', error);
    return { error: error as Error };
  }
}