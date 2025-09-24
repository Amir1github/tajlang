export type LeaderboardUser = {
    id: string;
    username: string;
    description: string;
    avatar_url: string;
    xp_points: number;
    status?: 'online' | 'offline';
    last_seen?: string | null;
    best_streak: number;
    rank?: number;
    want_chats?: boolean;
  };
  
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