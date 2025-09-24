import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}
export async function getUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('[supabase.ts] Ошибка получения пользователя:', error);
      return { user: null, error };
    }
    return { user: data?.user || null, error: null };
  } catch (err) {
    console.error('[supabase.ts] Исключение при получении пользователя:', err);
    return { user: null, error: err };
  }
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
  status?: 'online' | 'offline';
  last_seen?: string;
  want_chats?: boolean;
  created_at: string;
  updated_at: string;
};

// Types for messaging
export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  sender?: Profile;
  receiver?: Profile;
};

export type Chat = {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  user1?: Profile;
  user2?: Profile;
  unread_count?: number;
};

export async function updateUserStatus(userId: string, status: 'online' | 'offline') {
  try {
    const updates: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // If going offline, update last_seen timestamp
    if (status === 'offline') {
      updates.last_seen = new Date().toISOString();
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating user status:', error);
    return { error: error as Error };
  }
}

export async function getUserStatus(userId: string): Promise<{
  status: 'online' | 'offline';
  lastSeen?: string;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('status, last_seen, updated_at')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // If no explicit status is set, determine based on last activity
    let status: 'online' | 'offline' = data.status || 'offline';
    
    // If status is online but last update was more than 5 minutes ago, consider offline
    if (status === 'online' && data.updated_at) {
      const lastUpdate = new Date(data.updated_at);
      const now = new Date();
      const minutesAgo = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
      
      if (minutesAgo > 5) {
        status = 'offline';
      }
    }

    return {
      status,
      lastSeen: data.last_seen,
      error: null,
    };
  } catch (error) {
    console.error('Error getting user status:', error);
    return {
      status: 'offline',
      error: error as Error,
    };
  }
}

// Auto status management
export function setupStatusTracking(userId: string) {
  let statusInterval: NodeJS.Timeout;

  const updateOnlineStatus = () => {
    updateUserStatus(userId, 'online');
  };

  const startTracking = () => {
    // Set initial online status
    updateOnlineStatus();
    
    // Update status every 2 minutes to maintain online presence
    statusInterval = setInterval(updateOnlineStatus, 2 * 60 * 1000);
    
    // Set offline when app goes to background/closes
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        updateUserStatus(userId, 'offline');
      } else if (nextAppState === 'active') {
        updateOnlineStatus();
      }
    };

    // For React Native
    if (typeof window !== 'undefined' && window.addEventListener) {
      // Web environment
      window.addEventListener('beforeunload', () => {
        updateUserStatus(userId, 'offline');
      });
      
      window.addEventListener('focus', updateOnlineStatus);
      window.addEventListener('blur', () => {
        updateUserStatus(userId, 'offline');
      });
    }

    return () => {
      clearInterval(statusInterval);
      updateUserStatus(userId, 'offline');
    };
  };

  return { startTracking };
}


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

// Получить текущего пользователя из Supabase Auth

// Chat functions
export async function createChat(user1Id: string, user2Id: string): Promise<{ chat: Chat | null; error: Error | null }> {
  try {
    // Check if chat already exists
    const { data: existingChat, error: existingError } = await supabase
      .from('chats')
      .select('*')
      .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
      .single();

    if (existingChat) {
      return { chat: existingChat, error: null };
    }

    // Create new chat
    const { data: newChat, error } = await supabase
      .from('chats')
      .insert({
        user1_id: user1Id,
        user2_id: user2Id,
      })
      .select('*')
      .single();

    if (error) throw error;
    return { chat: newChat, error: null };
  } catch (error) {
    console.error('Error creating chat:', error);
    return { chat: null, error: error as Error };
  }
}

export async function sendMessage(chatId: string, senderId: string, receiverId: string, content: string): Promise<{ message: Message | null; error: Error | null }> {
  try {
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        receiver_id: receiverId,
        content: content,
        read: false,
      })
      .select('*')
      .single();

    if (error) throw error;
    return { message, error: null };
  } catch (error) {
    console.error('Error sending message:', error);
    return { message: null, error: error as Error };
  }
}

export async function getChats(userId: string): Promise<{ chats: Chat[]; error: Error | null }> {
  try {
    const { data: chats, error } = await supabase
      .from('chats')
      .select(`
        *,
        user1:profiles!chats_user1_id_fkey(*),
        user2:profiles!chats_user2_id_fkey(*),
        messages:messages(*)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Process chats to add last message and unread count
    const processedChats = chats?.map(chat => {
      const messages = chat.messages || [];
      const lastMessage = messages.length > 0 
        ? messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        : null;
      
      const unreadCount = messages.filter(msg => 
        msg.receiver_id === userId && !msg.read
      ).length;

      return {
        ...chat,
        last_message: lastMessage,
        unread_count: unreadCount,
      };
    }) || [];

    return { chats: processedChats, error: null };
  } catch (error) {
    console.error('Error getting chats:', error);
    return { chats: [], error: error as Error };
  }
}

export async function getMessages(chatId: string, userId: string): Promise<{ messages: Message[]; error: Error | null }> {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(*),
        receiver:profiles!messages_receiver_id_fkey(*)
      `)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Mark messages as read
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('chat_id', chatId)
      .eq('receiver_id', userId)
      .eq('read', false);

    return { messages: messages || [], error: null };
  } catch (error) {
    console.error('Error getting messages:', error);
    return { messages: [], error: error as Error };
  }
}

export async function updateWantChats(userId: string, wantChats: boolean): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ want_chats: wantChats })
      .eq('id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating want_chats:', error);
    return { error: error as Error };
  }
}

// Real-time subscription for messages
export function subscribeToMessages(userId: string, callback: (message: Message) => void) {
  const channel = supabase.channel('messages')
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'messages',
      filter: `receiver_id=eq.${userId}`
    }, (payload) => {
      callback(payload.new as Message);
    })
    .subscribe();

  return channel;
}