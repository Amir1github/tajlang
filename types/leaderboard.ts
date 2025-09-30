export interface LeaderboardUser {
  id: string;
  username: string;
  description: string | null;
  avatar_url: string | null;
  xp_points: number;
  best_streak: number;
  status: 'online' | 'offline';
  last_seen: string | null;
  want_chats: boolean;
  rank: number;
  location?: string; // Готово к использованию когда добавите в БД
}
  
  export type UserStatus = 'online' | 'offline';
  
  export interface LeaderboardItemProps {
    item: LeaderboardUser;
    colors: any;
    onPress: (user: LeaderboardUser) => void;
  }
  
  export interface UserProfileModalProps {
    visible: boolean;
    user: LeaderboardUser | null;
    loading: boolean;
    colors: any;
    t: (key: string) => string;
    onClose: () => void;
  }