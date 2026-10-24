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
  submitted_by?: string;
  source?: string;
}

export interface ChallengeContribution {
  id: string;
  challenge_id: string;
  contributor_name: string;
  amount: number;
  note: string;
  created_at: string;
  verified_by: string | null;
}

export interface VolunteerSignup {
  id: string;
  request_id: string;
  volunteer_name: string | null;
  created_at: string;
  hours: number | null;
  what_done: string | null;
  verified_by: string | null;
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
  volunteers_target?: number | null;
  volunteers_count?: number;
}
