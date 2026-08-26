import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export interface CountyChallenge {
  id: string;
  title: string;
  description: string;
  target_count: number;
  unit: string;
  icon: string;
  category: string;
  active: boolean;
}

export interface ChallengeContribution {
  id: string;
  challenge_id: string;
  contributor_name: string;
  amount: number;
  note: string;
  created_at: string;
}

export interface HelpRequest {
  id: string;
  type: 'request' | 'offer';
  category: string;
  title: string;
  description: string;
  contact_name: string;
  location: string;
  status: 'open' | 'fulfilled';
  urgency: 'low' | 'medium' | 'high';
  created_at: string;
}
