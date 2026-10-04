export interface HabitLog {
  date: string;
  verified: boolean;
  verifiedBy: string;
  verifiedAt: string;
  verifiedWhere: string;
  note: string;
}

export interface HabitLocation {
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  goalCount: number;
  logs: HabitLog[];
  location?: HabitLocation;
  isPrivate?: boolean;
  createdAt: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  earnedAt?: number;
  custom?: boolean;
}

export interface Topic {
  id: string;
  name: string;
  blurb: string;
  icon: string;
  color: string;
  custom?: boolean;
}

export interface CommunityPost {
  id: string;
  author: string;
  message: string;
  category: string;
  createdAt: number;
  cheers: number;
  cheered?: boolean;
  reported?: boolean;
}

export interface Profile {
  name: string;
}

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
}
