import type { Badge } from './types';

export interface Reward {
  title: string;
  description: string;
  icon: string;
}

type Category = 'eco' | 'reading' | 'chores' | 'fitness' | 'hydration' | 'community' | 'general';

const TIER_REWARD_LEVELS: Record<Badge['tier'], { magnitude: string; perk: string }> = {
  bronze: { magnitude: 'A small token', perk: 'bragging rights' },
  silver: { magnitude: 'A earned reward', perk: 'a special perk' },
  gold: { magnitude: 'A big reward', perk: 'a premium perk' },
  platinum: { magnitude: 'An ultimate reward', perk: 'legendary status' },
};

const CATEGORY_REWARDS: Record<Category, Record<Badge['tier'], Reward>> = {
  eco: {
    bronze: { title: 'Eco Starter Pin', description: 'You earned a reusable produce bag — pick one up at the Johnston County recycling center!', icon: '♻️' },
    silver: { title: 'Green Guardian Kit', description: 'You unlocked a compost bin starter kit from the Smithfield Extension Office.', icon: '🌱' },
    gold: { title: 'Eco Champion Award', description: 'You earned a native tree planted in your name at a Johnston County park!', icon: '🌳' },
    platinum: { title: 'Sustainability Legend', description: 'You get a personal tour of the Johnston County landfill recycling facility with the county environmental team.', icon: '🌍' },
  },
  reading: {
    bronze: { title: 'Bookworm Bookmark', description: 'You earned a custom JoCo bookmark from the Hocutt-Ellington Library!', icon: '📚' },
    silver: { title: 'Reading Star Kit', description: 'You unlocked a free book of your choice from the Selma Public Library.', icon: '⭐' },
    gold: { title: 'Library Champion', description: 'You earned a lifetime library card upgrade and a featured spot on the library wall!', icon: '🏆' },
    platinum: { title: 'Literary Legend', description: 'You get to name a character in the next community storytelling event at the Clayton library.', icon: '📖' },
  },
  chores: {
    bronze: { title: 'Helping Hands Star', description: 'You earned an extra $2 allowance bonus this week!', icon: '🧹' },
    silver: { title: 'Chore Champion Badge', description: 'You unlocked a chore-free day — pick any day off from chores!', icon: '🏅' },
    gold: { title: 'Household Hero', description: 'You earned a $10 bonus and a pick of your favorite dinner!', icon: '🏆' },
    platinum: { title: 'Responsibility Legend', description: 'You get a full weekend off from ALL chores plus a family outing of your choice!', icon: '👑' },
  },
  fitness: {
    bronze: { title: 'Trailblazer Pin', description: 'You earned a Neuse River Greenway water bottle sticker!', icon: '🚶' },
    silver: { title: 'Step Streak Reward', description: 'You unlocked a free day pass to the Clayton Community Center gym!', icon: '🔥' },
    gold: { title: 'Peak Performer Award', description: 'You earned a new pair of walking shoes from a local Johnston County sports shop!', icon: '🥾' },
    platinum: { title: 'Fitness Legend', description: 'You get a personal guided hike at Raven Rock State Park with a park ranger!', icon: '⛰️' },
  },
  hydration: {
    bronze: { title: 'Hydration Starter', description: 'You earned a JoCo water tracker sticker for your bottle!', icon: '💧' },
    silver: { title: 'Water Warrior', description: 'You unlocked a brand new reusable water bottle!', icon: '🏆' },
    gold: { title: 'Hydration Master', description: 'You earned a premium insulated water bottle and a month of free flavored water drops!', icon: '🌊' },
    platinum: { title: 'Hydration Legend', description: 'You get a personal water fountain dedication in your honor at a Johnston County park!', icon: '💎' },
  },
  community: {
    bronze: { title: 'Community Helper Pin', description: 'You earned a volunteer certificate from Johnston County!', icon: '🤝' },
    silver: { title: 'Neighbor Champion', description: 'You unlocked a featured spotlight in the JoCo District 13 community newsletter!', icon: '🌟' },
    gold: { title: 'Community Hero Award', description: 'You earned a $50 donation to the Johnston County charity of your choice!', icon: '🏆' },
    platinum: { title: 'Community Legend', description: 'You get a personalized proclamation from the Johnston County Board of Commissioners!', icon: '🏛️' },
  },
  general: {
    bronze: { title: 'Getting Started Reward', description: 'You earned a JoCo District 13 sticker and a shoutout on the community board!', icon: '🌟' },
    silver: { title: 'Consistency Reward', description: 'You unlocked a special JoCo tote bag for your dedication!', icon: '🎯' },
    gold: { title: 'Goal Getter Award', description: 'You earned a $20 gift card to a local Johnston County business!', icon: '🏆' },
    platinum: { title: 'Well-Rounded Legend', description: 'You get a personalized achievement plaque from JoCo District 13!', icon: '🎖️' },
  },
};

function detectCategory(name: string, description: string): Category {
  const text = (name + ' ' + description).toLowerCase();
  if (text.includes('recyc') || text.includes('eco') || text.includes('green') || text.includes('compost') || text.includes('sustain')) return 'eco';
  if (text.includes('read') || text.includes('book') || text.includes('library')) return 'reading';
  if (text.includes('chore') || text.includes('clean') || text.includes('tidy') || text.includes('laundry') || text.includes('dish')) return 'chores';
  if (text.includes('walk') || text.includes('step') || text.includes('hike') || text.includes('fit') || text.includes('trail') || text.includes('bike')) return 'fitness';
  if (text.includes('water') || text.includes('hydrat') || text.includes('drink')) return 'hydration';
  if (text.includes('volunteer') || text.includes('community') || text.includes('service') || text.includes('help') || text.includes('neighbor')) return 'community';
  return 'general';
}

export function getBadgeReward(badge: Badge): Reward {
  const category = detectCategory(badge.name, badge.description);
  const tierRewards = CATEGORY_REWARDS[category];
  return tierRewards[badge.tier] ?? CATEGORY_REWARDS.general[badge.tier] ?? CATEGORY_REWARDS.general.bronze;
}
