export interface Message {
    role: 'user' | 'bot' | 'thinking';
    text: string;
    aiType?: string;
    avatar?: string;
    aiName?: string;
  }
  
  export interface Chat {
    id: string;
    title: string;
    messages: Message[];
    aiType: string;
    mode: string;
    createdAt: string;
    updatedAt: string;
    lastMessage: string;
  }
  
  export interface AIConfig {
    name: string;
    version: string;
    description: string;
    avatar: string;
    color: string;
    website?: string; // Optional website link
  }
  
  export interface AmeenaMode {
    title: string;
    description: string;
    system_prompt: string;
  }
  
  export interface ResponsiveDimensions {
    width: number;
    height: number;
    isTablet: boolean;
    isDesktop: boolean;
    isLandscape: boolean;
    headerPadding: number;
    contentPadding: number;
    fontSize: {
      large: number;
      medium: number;
      small: number;
      tiny: number;
    };
    spacing: {
      large: number;
      medium: number;
      small: number;
    };
    borderRadius: {
      large: number;
      medium: number;
      small: number;
    };
    messageMaxWidth: string | number;
    chatListWidth: number;
    buttonHeight: number;
    inputHeight: number;
  }