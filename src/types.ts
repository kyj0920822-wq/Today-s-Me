export type Mood = 'happy' | 'neutral' | 'sad' | 'angry' | 'exhausted';
export type MealQuality = 'poor' | 'fair' | 'good' | 'perfect';
export type SocialEnergy = 'drained' | 'low' | 'balanced' | 'chilling' | 'high';
export type Level = 'low' | 'medium' | 'high';

export interface DailyStatus {
  id?: string;
  userId: string;
  sleepHours: number;
  mood: Mood;
  meal: MealQuality;
  socialEnergy: SocialEnergy;
  fatigue: Level;
  hunger: Level;
  studyAmount: Level;
  date: string; // YYYY-MM-DD
  timestamp?: string;
  updatedAt: any;
  characterType: string;
  description: string;
  energyPercent: number;
  oneLiner?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  friendCode: string;
  currentStatusId?: string;
  lastActive: any;
}

export interface Reaction {
  id: string;
  type: 'like' | 'coffee' | 'hug' | 'food';
  fromUserId: string;
  fromName: string;
  timestamp: any;
}

export type CharacterState = 
  | 'happy'        // 기분 좋음
  | 'neutral'      // 보통
  | 'sad'          // 슬픔
  | 'angry'        // 화남
  | 'exhausted';    // 지침

export interface CharacterConfig {
  state: CharacterState;
  primaryColor: string;
  secondaryColor: string;
  eyeType: 'dot' | 'line' | 'star' | 'circle' | 'heart' | 'half-moon' | 'closed' | 'wink' | 'dizzy';
  mouthType: 'smile' | 'meh' | 'sad' | 'open' | 'flat' | 'pout' | 'drool' | 'tongue' | 'kiss';
  eyebrowType?: 'none' | 'normal' | 'angry' | 'sad' | 'surprised' | 'worried';
  accessory?: 'sweat' | 'sparkles' | 'fire' | 'zzz' | 'heart' | 'book' | 'bread' | 'party' | 'cloud' | 'shield' | 'coffee' | 'laptop' | 'music' | 'moon' | 'sun' | 'rain' | 'star' | 'ghost';
}
