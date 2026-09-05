export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  inputType?: 'text' | 'voice';
}

export interface SavedConversation {
  id: string;
  title: string;
  isCustomTitle?: boolean;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  previewText?: string;
}

export interface UserProfile {
  displayName: string;
  email: string;
  authProvider: 'Google' | 'Sukoon Account';
}

export interface UserPreferences {
  fontSize: 'normal' | 'relaxed';
  voiceSpeed: 'gentle' | 'natural';
  autoReadVoice: boolean;
  language: string;
  reducedMotion: boolean;
}
