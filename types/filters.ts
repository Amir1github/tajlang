export type SortOption = 
  | 'xp_desc' 
  | 'xp_asc' 
  | 'streak_desc' 
  | 'streak_asc' 
  | 'last_seen'
  | 'username';

export interface FilterOptions {
  minXP?: number;
  maxXP?: number;
  minStreak?: number;
  onlineStatus?: 'online' | 'offline';
  wantChats?: boolean;
  location?: string; // Готово к использованию когда добавите локации
}

export interface SortOptionItem {
  value: SortOption;
  label: string;
  icon?: string;
}