import type { Habit, HabitLog, Badge, Topic, CommunityPost, Profile } from './types';

const HABITS_KEY = 'joco-habits-v2';
const BADGES_KEY = 'joco-badges-v1';
const TOPICS_KEY = 'joco-topics-v1';
const POSTS_KEY = 'joco-posts-v1';
const PROFILE_KEY = 'joco-profile-v1';

function migrateLog(log: HabitLog | string): HabitLog {
  if (typeof log === 'string') {
    return { date: log, verified: true, verifiedBy: 'Self', verifiedAt: '', verifiedWhere: '', note: '' };
  }
  return log;
}

function migrateHabit(h: Habit): Habit {
  return { ...h, logs: h.logs.map(migrateLog) };
}

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(HABITS_KEY);
    if (!raw) return getDefaultHabits();
    const parsed: Habit[] = JSON.parse(raw);
    return parsed.map(migrateHabit);
  } catch { return getDefaultHabits(); }
}
export function saveHabits(h: Habit[]) { localStorage.setItem(HABITS_KEY, JSON.stringify(h)); }

export function loadBadges(): Badge[] {
  try {
    const raw = localStorage.getItem(BADGES_KEY);
    if (!raw) return getDefaultBadges();
    return JSON.parse(raw);
  } catch { return getDefaultBadges(); }
}
export function saveBadges(b: Badge[]) { localStorage.setItem(BADGES_KEY, JSON.stringify(b)); }

export function loadTopics(): Topic[] {
  try {
    const raw = localStorage.getItem(TOPICS_KEY);
    if (!raw) return getDefaultTopics();
    const saved: Topic[] = JSON.parse(raw);
    const defaults = getDefaultTopics();
    const existingIds = new Set(saved.map(t => t.id));
    const merged = [...saved];
    for (const d of defaults) {
      if (!existingIds.has(d.id)) merged.push(d);
    }
    return merged;
  } catch { return getDefaultTopics(); }
}
export function saveTopics(t: Topic[]) { localStorage.setItem(TOPICS_KEY, JSON.stringify(t)); }

export function loadPosts(): CommunityPost[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) return getDefaultPosts();
    return JSON.parse(raw);
  } catch { return getDefaultPosts(); }
}
export function savePosts(p: CommunityPost[]) { localStorage.setItem(POSTS_KEY, JSON.stringify(p)); }

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { name: '' };
    return JSON.parse(raw);
  } catch { return { name: '' }; }
}
export function saveProfile(p: Profile) { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); }

function getDefaultHabits(): Habit[] {
  return [
    { id: 'h1', name: 'Walk the Neuse River Greenway', description: 'Walk, run, or bike this scenic 33-mile trail along the Neuse River.', goalCount: 10, logs: [], location: { name: 'Neuse River Greenway Trailhead', lat: 35.7848, lng: -78.6805, address: '14254 Riverwood Dr, Raleigh, NC' }, createdAt: Date.now() },
    { id: 'h2', name: 'Visit the Clayton River Walk', description: 'Stroll the boardwalk along the Neuse in downtown Clayton.', goalCount: 5, logs: [], location: { name: 'Clayton River Walk', lat: 35.6476, lng: -78.4564, address: '2nd St & Main St, Clayton, NC' }, createdAt: Date.now() },
    { id: 'h3', name: 'Explore Buffalo Creek Greenway', description: 'Walk the greenway from Wendell Falls to the Little River.', goalCount: 8, logs: [], location: { name: 'Buffalo Creek Greenway', lat: 35.7801, lng: -78.3689, address: 'Wendell Falls Pkwy, Wendell, NC' }, createdAt: Date.now() },
    { id: 'h4', name: 'Hike at Raven Rock State Park', description: 'Hike the Raven Rock Loop and enjoy views of the Cape Fear River.', goalCount: 4, logs: [], location: { name: 'Raven Rock State Park', lat: 35.4652, lng: -78.9473, address: '3009 Raven Rock Rd, Lillington, NC' }, createdAt: Date.now() },
    { id: 'h5', name: 'Recycle at the Johnston County Convenience Center', description: 'Drop off recycling and keep waste out of the landfill.', goalCount: 12, logs: [], location: { name: 'Johnston County Convenience Center', lat: 35.5885, lng: -78.5234, address: '680 landfill rd, Smithfield, NC' }, createdAt: Date.now() },
  ];
}

function getDefaultBadges(): Badge[] {
  return [
    { id: 'b1', name: 'Recycle Streak', description: 'Recycle 7 days in a row', emoji: '♻️', tier: 'bronze' },
    { id: 'b2', name: 'Eco Champion', description: 'Hit 20 eco-goal completions', emoji: '🌱', tier: 'silver' },
    { id: 'b3', name: 'Green Logger', description: 'Log 14 eco activities', emoji: '🌳', tier: 'bronze' },
    { id: 'b4', name: 'Bookworm', description: 'Read 5 days in a row', emoji: '📚', tier: 'bronze' },
    { id: 'b5', name: 'Reading Star', description: 'Hit 15 reading goals', emoji: '⭐', tier: 'silver' },
    { id: 'b6', name: 'Chore Champion', description: 'Do chores 7 days straight', emoji: '🧹', tier: 'bronze' },
    { id: 'b7', name: 'Tidy Hero', description: 'Hit 10 chore goals', emoji: '🏅', tier: 'silver' },
    { id: 'b8', name: 'Trailblazer', description: 'Walk or hike 10 times', emoji: '🚶', tier: 'bronze' },
    { id: 'b9', name: 'Peak Performer', description: 'Walk or hike 30 times', emoji: '🥾', tier: 'gold' },
    { id: 'b10', name: 'Step Streak', description: 'Walk 5 days in a row', emoji: '🔥', tier: 'silver' },
    { id: 'b11', name: 'Hydration Master', description: 'Drink water 10 days straight', emoji: '💧', tier: 'silver' },
    { id: 'b12', name: 'Community Helper', description: 'Volunteer 5 times', emoji: '🤝', tier: 'gold' },
    { id: 'b13', name: 'Level 5 Achiever', description: 'Reach level 5', emoji: '🏆', tier: 'gold' },
    { id: 'b14', name: 'Getting Started', description: 'Hit a 3-day streak', emoji: '🌟', tier: 'bronze' },
    { id: 'b15', name: 'Goal Getter', description: 'Hit 25 total goals', emoji: '🎯', tier: 'silver' },
    { id: 'b16', name: 'Well-Rounded', description: 'Track 3 different topics', emoji: '🎖️', tier: 'platinum' },
  ];
}

function getDefaultTopics(): Topic[] {
  return [
    { id: 't1', name: 'Sustainability', blurb: 'Recycling, composting, eco choices', icon: '🌱', color: '#3ba55d' },
    { id: 't2', name: 'Reading', blurb: 'Daily reading habit', icon: '📚', color: '#4a90d9' },
    { id: 't3', name: 'Chores & Allowance', blurb: 'Help around the house', icon: '🧹', color: '#d98a3b' },
    { id: 't4', name: 'Fitness Basics', blurb: 'Walk, run, hike, move', icon: '🚶', color: '#e74c3c' },
    { id: 't7', name: 'Healthy Eating', blurb: 'Fresh, local, nourishing food', icon: '🥗', color: '#2ecc71' },
    { id: 't6', name: 'Community Service', blurb: 'Volunteer and help neighbors', icon: '🤝', color: '#f39c12' },
    { id: 't5', name: 'Hydration', blurb: 'Drink water daily', icon: '💧', color: '#1abc9c' },
  ];
}

function getDefaultPosts(): CommunityPost[] {
  return [
    { id: 'p1', author: 'Maria G.', message: 'Just finished my 5th walk on the Neuse River Greenway — the fall leaves are gorgeous right now!', category: 'Fitness Basics', createdAt: Date.now() - 3600000, cheers: 3 },
    { id: 'p2', author: 'James T.', message: 'Tip: the Clayton River Walk parking is free on weekends. Great spot for families!', category: 'Community Service', createdAt: Date.now() - 7200000, cheers: 5 },
  ];
}
