export type BeastTier = 'common' | 'rare' | 'epic' | 'mega' | 'heroic' | 'mythic' | 'legendary';

export interface Beast {
  id: string;
  name: string;
  emoji: string;
  tier: BeastTier;
  power: string;
  lore: string;
}

export const TIER_ORDER: BeastTier[] = ['common', 'rare', 'epic', 'mega', 'heroic', 'mythic', 'legendary'];

export const BEAST_TIER_INFO: Record<BeastTier, { label: string; color: string; glow: string; eggColor: string; tapsRequired: number }> = {
  common:    { label: 'Common',    color: '#a0b8e0', glow: 'rgba(160,184,224,0.4)',  eggColor: '#c8d4e8', tapsRequired: 0 },
  rare:      { label: 'Rare',      color: '#3ba55d', glow: 'rgba(59,165,93,0.5)',    eggColor: '#7fd99a', tapsRequired: 1 },
  epic:      { label: 'Epic',      color: '#f0a93b', glow: 'rgba(240,169,59,0.55)',  eggColor: '#ffc966', tapsRequired: 1 },
  mega:      { label: 'Mega',      color: '#e05656', glow: 'rgba(224,86,86,0.55)',   eggColor: '#ff8080', tapsRequired: 1 },
  heroic:    { label: 'Heroic',    color: '#60a5fa', glow: 'rgba(96,165,250,0.6)',   eggColor: '#9cccff', tapsRequired: 1 },
  mythic:    { label: 'Mythic',    color: '#c084fc', glow: 'rgba(192,132,252,0.6)',  eggColor: '#dab0ff', tapsRequired: 1 },
  legendary: { label: 'Legendary', color: '#ffd700', glow: 'rgba(255,215,0,0.7)',    eggColor: '#ffe566', tapsRequired: 1 },
};

export const BEASTS: Beast[] = [
  // Common
  { id: 'mud-pup',      name: 'Mud Pup',           emoji: '🦮', tier: 'common', power: 'Encouragement', lore: 'A loyal companion that cheers you on every step of the way.' },
  { id: 'sprout-lizard', name: 'Sprout Lizard',    emoji: '🦎', tier: 'common', power: 'Persistence', lore: 'Sheds its tail and grows back stronger — just like your habits.' },
  { id: 'pebble-toad',   name: 'Pebble Toad',       emoji: '🐸', tier: 'common', power: 'Steadiness', lore: 'Never in a rush, always arrives on time.' },
  { id: 'dawn-finch',    name: 'Dawn Finch',        emoji: '🐦', tier: 'common', power: 'Early Rising', lore: 'Sings the first song of every morning in JoCo.' },

  // Rare
  { id: 'river-otter',   name: 'River Otter',       emoji: '🦦', tier: 'rare', power: 'Playfulness', lore: 'Turns every chore into a game along the Neuse River.' },
  { id: 'garden-fox',    name: 'Garden Fox',        emoji: '🦊', tier: 'rare', power: 'Cleverness', lore: 'Knows every shortcut through the Clayton community gardens.' },
  { id: 'marsh-heron',   name: 'Marsh Heron',       emoji: '🦩', tier: 'rare', power: 'Patience', lore: 'Stands perfectly still until the perfect moment strikes.' },

  // Epic
  { id: 'storm-hawk',    name: 'Storm Hawk',        emoji: '🦅', tier: 'epic', power: 'Focus', lore: 'Flies above the clouds to see the whole county at once.' },
  { id: 'iron-badger',   name: 'Iron Badger',       emoji: '🦡', tier: 'epic', power: 'Determination', lore: 'Digs deeper than any other beast in Johnston County.' },
  { id: 'creek-snapper', name: 'Creek Snapper',     emoji: '🐢', tier: 'epic', power: 'Endurance', lore: 'Has crossed every waterway in JoCo without rushing.' },

  // Mega
  { id: 'ridge-stag',    name: 'Ridge Stag',        emoji: '🦌', tier: 'mega', power: 'Strength', lore: 'Leaps across the ravines at Raven Rock in a single bound.' },
  { id: 'flame-mare',    name: 'Flame Mare',        emoji: '🐴', tier: 'mega', power: 'Speed', lore: 'Gallops the entire Neuse Greenway before sunrise.' },
  { id: 'stone-golem',   name: 'Stone Golem',       emoji: '🗿', tier: 'mega', power: 'Fortitude', lore: 'Built from the rocks of the JoCo landfill, reborn as a guardian.' },

  // Heroic
  { id: 'wave-orca',     name: 'Wave Orca',         emoji: '🐋', tier: 'heroic', power: 'Leadership', lore: 'Leads the pod through every storm in the Cape Fear.' },
  { id: 'sky-titan',     name: 'Sky Titan',         emoji: '🦤', tier: 'heroic', power: 'Vision', lore: 'Sees three counties from the sky and guides the lost home.' },
  { id: 'thunder-bison', name: 'Thunder Bison',     emoji: '🐃', tier: 'heroic', power: 'Resilience', lore: 'Shakes the ground with every step, unstoppable in its path.' },

  // Mythic
  { id: 'crystal-wolf',  name: 'Crystal Wolf',      emoji: '🐺', tier: 'mythic', power: 'Instinct', lore: 'Its howl shatters doubt. Found only by those who never skip a day.' },
  { id: 'ember-phoenix', name: 'Ember Phoenix',     emoji: '🔥', tier: 'mythic', power: 'Rebirth', lore: 'Rises from the ashes of broken habits, stronger every time.' },
  { id: 'frost-dragon',  name: 'Frost Dragon',      emoji: '🐉', tier: 'mythic', power: 'Mastery', lore: 'Guardian of the winter greenways, breathes clarity and focus.' },

  // Legendary
  { id: 'cosmic-leo',    name: 'Cosmic Leo',        emoji: '🦁', tier: 'legendary', power: 'Radiance', lore: 'The king of all JoCo beasts. Appears only to those who complete every goal.' },
  { id: 'aether-unicorn', name: 'Aether Unicorn',   emoji: '🦄', tier: 'legendary', power: 'Purity', lore: 'A mythical being of pure motivation. Said to grant perfect consistency.' },
  { id: 'celestial-dragon', name: 'Celestial Dragon', emoji: '🐲', tier: 'legendary', power: 'Omniscience', lore: 'The ultimate guardian of Johnston County. Its roar echoes across all 13 districts.' },
];

const BEASTS_BY_ID: Record<string, Beast> = Object.fromEntries(BEASTS.map(b => [b.id, b]));

export interface CollectedBeast {
  beastId: string;
  tier: BeastTier;
  collectedAt: number;
  source: string;
}

export function rollBeast(): Beast {
  const commonBeasts = BEASTS.filter(b => b.tier === 'common');
  return commonBeasts[Math.floor(Math.random() * commonBeasts.length)];
}

export function getBeastForTier(tier: BeastTier): Beast {
  const pool = BEASTS.filter(b => b.tier === tier);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getBeastById(id: string): Beast | undefined {
  return BEASTS_BY_ID[id];
}

export function isBeastCollected(collected: CollectedBeast[], beastId: string, tier: BeastTier): boolean {
  return collected.some(c => c.beastId === beastId && c.tier === tier);
}
