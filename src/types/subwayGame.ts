export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Passenger {
  id: number;
  name: string;
  avatar: string;
  type: 'kind' | 'ignoring_phone' | 'fake_sleeping';
  dialogue: string;
  isOfferedSeat: boolean;
}

export interface PlayerProfile {
  name: string;
  badgeStyle: 'pink_heart' | 'bear' | 'star';
  avatar: string;
}

export type GamePhase = 'welcome' | 'playing' | 'won' | 'lost';
