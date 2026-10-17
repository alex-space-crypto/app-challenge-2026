export type BeastTier = 'common' | 'rare' | 'epic' | 'mega' | 'heroic' | 'mythic' | 'legendary';

export interface BeastAbility {
  label: string;
  icon: string;
  response: string;
  reaction: string;
}

export interface Beast {
  id: string;
  name: string;
  emoji: string;
  tier: BeastTier;
  power: string;
  lore: string;
  abilities: BeastAbility[];
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
  { id: 'mud-pup',      name: 'Mud Pup',           emoji: '🦮', tier: 'common', power: 'Encouragement', lore: 'A loyal companion that cheers you on every step of the way.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Mud Pup wags its tail and you feel a surge of motivation! +1 XP boost today!', reaction: 'power' },
      { label: 'Play',     icon: '🎾', response: 'Mud Pup fetches the ball and brings it back, panting with joy!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'Mud Pup curls up in your lap. You feel warm and supported.', reaction: 'calm' },
    ] },
  { id: 'sprout-lizard', name: 'Sprout Lizard',    emoji: '🦎', tier: 'common', power: 'Persistence', lore: 'Sheds its tail and grows back stronger — just like your habits.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Sprout Lizard regenerates its tail — your broken streak starts fresh today!', reaction: 'power' },
      { label: 'Play',     icon: '🦗', response: 'It chases a cricket across the ground, darting left and right!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It sits on a warm rock in your hand, basking in the sun.', reaction: 'calm' },
    ] },
  { id: 'pebble-toad',   name: 'Pebble Toad',       emoji: '🐸', tier: 'common', power: 'Steadiness', lore: 'Never in a rush, always arrives on time.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Pebble Toad grounds you. Your next goal feels steady and achievable.', reaction: 'power' },
      { label: 'Play',     icon: '💧', response: 'It puffs up and floats in a puddle, completely relaxed.', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It sits perfectly still on your hand, cool and calm.', reaction: 'calm' },
    ] },
  { id: 'dawn-finch',    name: 'Dawn Finch',        emoji: '🐦', tier: 'common', power: 'Early Rising', lore: 'Sings the first song of every morning in JoCo.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Dawn Finch sings and you feel ready to tackle your morning goals!', reaction: 'power' },
      { label: 'Play',     icon: '🎵', response: 'It hops from branch to branch, whistling a cheerful tune!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It nests in your cupped hands and chirps softly.', reaction: 'calm' },
    ] },

  // Rare
  { id: 'river-otter',   name: 'River Otter',       emoji: '🦦', tier: 'rare', power: 'Playfulness', lore: 'Turns every chore into a game along the Neuse River.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'River Otter splashes you with water — your chores suddenly feel fun!', reaction: 'power' },
      { label: 'Play',     icon: '🏊', response: 'It does three underwater somersaults and pops up grinning!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It rolls onto its back in your arms, squeaking contentedly.', reaction: 'calm' },
    ] },
  { id: 'garden-fox',    name: 'Garden Fox',        emoji: '🦊', tier: 'rare', power: 'Cleverness', lore: 'Knows every shortcut through the Clayton community gardens.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Garden Fox reveals a shortcut — you find a smarter way to do your goal!', reaction: 'power' },
      { label: 'Play',     icon: '🪶', response: 'It pounces on a leaf, tail whipping, then trots off proudly!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It curls its bushy tail around itself and leans against you.', reaction: 'calm' },
    ] },
  { id: 'marsh-heron',   name: 'Marsh Heron',       emoji: '🦩', tier: 'rare', power: 'Patience', lore: 'Stands perfectly still until the perfect moment strikes.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Marsh Heron teaches you stillness — your patience is rewarded with clarity.', reaction: 'power' },
      { label: 'Play',     icon: '🌊', response: 'It wades through shallow water, slow and elegant, then strikes at a fish!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It tucks its long neck and stands beside you like a calm guardian.', reaction: 'calm' },
    ] },

  // Epic
  { id: 'storm-hawk',    name: 'Storm Hawk',        emoji: '🦅', tier: 'epic', power: 'Focus', lore: 'Flies above the clouds to see the whole county at once.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Storm Hawk grants you its Focus power — distractions fade and your mind sharpens!', reaction: 'power' },
      { label: 'Play',     icon: '🌪️', response: 'It rides a thermal upward, circling higher and higher until it\'s a speck!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It folds its wings and perches on your shoulder, fierce but gentle.', reaction: 'calm' },
    ] },
  { id: 'iron-badger',   name: 'Iron Badger',       emoji: '🦡', tier: 'epic', power: 'Determination', lore: 'Digs deeper than any other beast in Johnston County.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Iron Badger activates Determination — you feel an unstoppable drive to finish!', reaction: 'power' },
      { label: 'Play',     icon: '⛏️', response: 'It tears through the dirt, digging a tunnel in seconds!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It stops digging and sits heavily beside you, solid and warm.', reaction: 'calm' },
    ] },
  { id: 'creek-snapper', name: 'Creek Snapper',     emoji: '🐢', tier: 'epic', power: 'Endurance', lore: 'Has crossed every waterway in JoCo without rushing.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Creek Snapper grants Endurance — you feel the strength to go the distance!', reaction: 'power' },
      { label: 'Play',     icon: '🌊', response: 'It slides into the creek and swims with surprising power!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It rests its ancient head on your hand, slow and steady.', reaction: 'calm' },
    ] },

  // Mega
  { id: 'ridge-stag',    name: 'Ridge Stag',        emoji: '🦌', tier: 'mega', power: 'Strength', lore: 'Leaps across the ravines at Raven Rock in a single bound.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Ridge Stag\'s Strength surges through you — you feel powerful enough to leap any obstacle!', reaction: 'power' },
      { label: 'Play',     icon: '🦸', response: 'It bounds across a ravine in a single jump, antlers gleaming!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It lowers its massive antlers beside you, standing guard like a fortress.', reaction: 'calm' },
    ] },
  { id: 'flame-mare',    name: 'Flame Mare',        emoji: '🐴', tier: 'mega', power: 'Speed', lore: 'Gallops the entire Neuse Greenway before sunrise.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Flame Mare grants Speed — everything feels faster and more effortless today!', reaction: 'power' },
      { label: 'Play',     icon: '🏁', response: 'It sprints past you in a blur, mane streaming like fire!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It slows to a walk and nuzzles your hand, warm as embers.', reaction: 'calm' },
    ] },
  { id: 'stone-golem',   name: 'Stone Golem',       emoji: '🗿', tier: 'mega', power: 'Fortitude', lore: 'Built from the rocks of the JoCo landfill, reborn as a guardian.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Stone Golem activates Fortitude — nothing can knock you off your path today!', reaction: 'power' },
      { label: 'Play',     icon: '🪨', response: 'It lifts a boulder overhead and stomps the ground, shaking the earth!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It stands beside you like a wall of stone, immovable and protecting.', reaction: 'calm' },
    ] },

  // Heroic
  { id: 'wave-orca',     name: 'Wave Orca',         emoji: '🐋', tier: 'heroic', power: 'Leadership', lore: 'Leads the pod through every storm in the Cape Fear.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Wave Orca grants Leadership — you feel ready to guide others and yourself to success!', reaction: 'power' },
      { label: 'Play',     icon: '🌊', response: 'It breaches out of the water in a majestic arc, then splashes down!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It floats beside you, clicking softly in its deep, wise voice.', reaction: 'calm' },
    ] },
  { id: 'sky-titan',     name: 'Sky Titan',         emoji: '🦤', tier: 'heroic', power: 'Vision', lore: 'Sees three counties from the sky and guides the lost home.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Sky Titan activates Vision — you see the big picture and your goals align!', reaction: 'power' },
      { label: 'Play',     icon: '🗺️', response: 'It soars above and spots a hidden trail you never noticed before!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It settles on a perch above you, watching over like a silent guardian.', reaction: 'calm' },
    ] },
  { id: 'thunder-bison', name: 'Thunder Bison',     emoji: '🐃', tier: 'heroic', power: 'Resilience', lore: 'Shakes the ground with every step, unstoppable in its path.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Thunder Bison grants Resilience — setbacks bounce off you like rain off a bison\'s back!', reaction: 'power' },
      { label: 'Play',     icon: '⛈️', response: 'It charges across the plains, hooves thundering, unstoppable!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It stands solid beside you, breathing deep and slow, a mountain of calm.', reaction: 'calm' },
    ] },

  // Mythic
  { id: 'crystal-wolf',  name: 'Crystal Wolf',      emoji: '🐺', tier: 'mythic', power: 'Instinct', lore: 'Its howl shatters doubt. Found only by those who never skip a day.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Crystal Wolf awakens Instinct — you know exactly what to do, no hesitation!', reaction: 'power' },
      { label: 'Play',     icon: '🔮', response: 'It howls and crystal shards ring out like wind chimes across the forest!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It presses its crystalline fur against you, cool and humming with energy.', reaction: 'calm' },
    ] },
  { id: 'ember-phoenix', name: 'Ember Phoenix',     emoji: '🔥', tier: 'mythic', power: 'Rebirth', lore: 'Rises from the ashes of broken habits, stronger every time.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Ember Phoenix activates Rebirth — one failed day doesn\'t matter. You rise again!', reaction: 'power' },
      { label: 'Play',     icon: '✨', response: 'It bursts into embers and reforms before your eyes, brighter each time!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'Its warm feathers wrap around you, comforting as a hearth fire.', reaction: 'calm' },
    ] },
  { id: 'frost-dragon',  name: 'Frost Dragon',      emoji: '🐉', tier: 'mythic', power: 'Mastery', lore: 'Guardian of the winter greenways, breathes clarity and focus.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Frost Dragon grants Mastery — your habits feel mastered, automatic, effortless!', reaction: 'power' },
      { label: 'Play',     icon: '❄️', response: 'It breathes a stream of frost, crystallizing the air into shimmering patterns!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It curls its icy tail around you, cool and clear, like a winter morning.', reaction: 'calm' },
    ] },

  // Legendary
  { id: 'cosmic-leo',    name: 'Cosmic Leo',        emoji: '🦁', tier: 'legendary', power: 'Radiance', lore: 'The king of all JoCo beasts. Appears only to those who complete every goal.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Cosmic Leo unleashes Radiance — you glow with achievement, inspiring everyone around you!', reaction: 'power' },
      { label: 'Play',     icon: '🌟', response: 'It roars and the stars themselves seem to align above Johnston County!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It rests its royal head on your lap, warm as sunlight, proud as a king.', reaction: 'calm' },
    ] },
  { id: 'aether-unicorn', name: 'Aether Unicorn',   emoji: '🦄', tier: 'legendary', power: 'Purity', lore: 'A mythical being of pure motivation. Said to grant perfect consistency.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Aether Unicorn grants Purity — your motivation is pure, your will unbreakable!', reaction: 'power' },
      { label: 'Play',     icon: '💫', response: 'It gallops through a field of starlight, horn blazing with white fire!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It nuzzles you and a wave of pure calm washes over your entire body.', reaction: 'calm' },
    ] },
  { id: 'celestial-dragon', name: 'Celestial Dragon', emoji: '🐲', tier: 'legendary', power: 'Omniscience', lore: 'The ultimate guardian of Johnston County. Its roar echoes across all 13 districts.',
    abilities: [
      { label: 'Activate', icon: '⚡', response: 'Celestial Dragon bestows Omniscience — you see all your goals, all your paths, all at once!', reaction: 'power' },
      { label: 'Play',     icon: '🌌', response: 'It coils through the sky and its roar echoes across all 13 JoCo districts!', reaction: 'happy' },
      { label: 'Cuddle',   icon: '🤗', response: 'It wraps around you protectively, scales shimmering with the light of galaxies.', reaction: 'calm' },
    ] },
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
