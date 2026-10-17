export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface CollectibleAnimal {
  id: string;
  name: string;
  emoji: string;
  rarity: Rarity;
  fact: string;
  habitat: string;
}

export const RARITY_INFO: Record<Rarity, { label: string; color: string; glow: string; weight: number; sound: string }> = {
  common:    { label: 'Common',    color: '#a0b8e0', glow: 'rgba(160,184,224,0.4)',  weight: 50, sound: 'sparkle' },
  rare:      { label: 'Rare',      color: '#3ba55d', glow: 'rgba(59,165,93,0.5)',    weight: 28, sound: 'chime' },
  epic:      { label: 'Epic',      color: '#f0a93b', glow: 'rgba(240,169,59,0.55)',  weight: 15, sound: 'fanfare' },
  legendary: { label: 'Legendary', color: '#ffd700', glow: 'rgba(255,215,0,0.6)',    weight: 7,  sound: 'legendary' },
};

export const ANIMALS: CollectibleAnimal[] = [
  // Common
  { id: 'squirrel',   name: 'Gray Squirrel',    emoji: '🐿️', rarity: 'common', fact: 'NC\'s state mammal, found in every county.', habitat: 'Forests & neighborhoods' },
  { id: 'cardinal',   name: 'Northern Cardinal', emoji: '🐦', rarity: 'common', fact: 'The state bird of North Carolina!', habitat: 'Backyards & woodlands' },
  { id: 'rabbit',     name: 'Eastern Cottontail', emoji: '🐰', rarity: 'common', fact: 'Can run up to 18 mph to escape predators.', habitat: 'Fields & meadows' },
  { id: 'turtle',     name: 'Box Turtle',         emoji: '🐢', rarity: 'common', fact: 'Can live over 100 years in the wild.', habitat: 'Forest floors & wetlands' },
  { id: 'frog',       name: 'Green Frog',         emoji: '🐸', rarity: 'common', fact: 'Calls sound like a loose banjo string.', habitat: 'Ponds & streams' },
  { id: 'duck',       name: 'Mallard Duck',       emoji: '🦆', rarity: 'common', fact: 'Can sleep with one eye open to stay alert.', habitat: 'Lakes & rivers' },
  { id: 'deer',       name: 'White-tailed Deer',  emoji: '🦌', rarity: 'common', fact: 'Can leap up to 10 feet high!', habitat: 'Forests & fields' },
  { id: 'raccoon',    name: 'Raccoon',            emoji: '🦝', rarity: 'common', fact: 'Can remember solutions to tasks for 3 years.', habitat: 'Woods & near water' },

  // Rare
  { id: 'fox',        name: 'Red Fox',            emoji: '🦊', rarity: 'rare', fact: 'Uses Earth\'s magnetic field to hunt prey.', habitat: 'Forest edges & fields' },
  { id: 'owl',        name: 'Barred Owl',         emoji: '🦉', rarity: 'rare', fact: 'Can rotate its head 270 degrees.', habitat: 'Swamps & old forests' },
  { id: 'beaver',     name: 'American Beaver',    emoji: '🦫', rarity: 'rare', fact: 'Engineers that build dams to create ponds.', habitat: 'Streams & rivers' },
  { id: 'otter',      name: 'River Otter',        emoji: '🦦', rarity: 'rare', fact: 'Can hold their breath underwater for 8 minutes.', habitat: 'Rivers & lakes' },
  { id: 'skunk',      name: 'Striped Skunk',      emoji: '🦨', rarity: 'rare', fact: 'Can spray up to 15 feet with accuracy.', habitat: 'Edges of forests' },
  { id: 'hedgehog',   name: 'Hedgehog',           emoji: '🦔', rarity: 'rare', fact: 'Has about 5,000 spines on its back.', habitat: 'Gardens & hedgerows' },

  // Epic
  { id: 'eagle',      name: 'Bald Eagle',         emoji: '🦅', rarity: 'epic', fact: 'Can spot fish from 2 miles away!', habitat: 'Near large bodies of water' },
  { id: 'wolf',       name: 'Red Wolf',           emoji: '🐺', rarity: 'epic', fact: 'One of the most endangered wolves in the world.', habitat: 'Coastal prairies & forests' },
  { id: 'bear',       name: 'Black Bear',         emoji: '🐻', rarity: 'epic', fact: 'Can smell food from 20 miles away.', habitat: 'Mountains & coastal forests' },
  { id: 'butterfly',  name: 'Monarch Butterfly',  emoji: '🦋', rarity: 'epic', fact: 'Migrates up to 3,000 miles each year.', habitat: 'Meadows & gardens' },
  { id: 'bat',        name: 'Big Brown Bat',      emoji: '🦇', rarity: 'epic', fact: 'Can eat 1,000 mosquitoes in one hour!', habitat: 'Caves & old buildings' },

  // Legendary
  { id: 'dragon',     name: 'Carolina Dragon',    emoji: '🐉', rarity: 'legendary', fact: 'A mythical guardian of the Neuse River.', habitat: 'Legend says deep in the swamps' },
  { id: 'unicorn',    name: 'Forest Unicorn',     emoji: '🦄', rarity: 'legendary', fact: 'Said to appear only to the most dedicated goal-trackers.', habitat: 'Ancient JoCo woodlands' },
  { id: 'phoenix',    name: 'Neuse Phoenix',      emoji: '🔥', rarity: 'legendary', fact: 'Rises from the Neuse River every 100 years.', habitat: 'River mist at dawn' },
];

const ANIMALS_BY_ID: Record<string, CollectibleAnimal> = Object.fromEntries(ANIMALS.map(a => [a.id, a]));

export interface CollectedAnimal {
  animalId: string;
  collectedAt: number;
  fromHabit: string;
}

export function rollAnimal(): CollectibleAnimal {
  const totalWeight = Object.values(RARITY_INFO).reduce((s, r) => s + r.weight, 0);
  let roll = Math.random() * totalWeight;
  let chosenRarity: Rarity = 'common';
  for (const [rarity, info] of Object.entries(RARITY_INFO)) {
    roll -= info.weight;
    if (roll <= 0) { chosenRarity = rarity as Rarity; break; }
  }
  const pool = ANIMALS.filter(a => a.rarity === chosenRarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getAnimalById(id: string): CollectibleAnimal | undefined {
  return ANIMALS_BY_ID[id];
}

export function isAlreadyCollected(collected: CollectedAnimal[], animalId: string): boolean {
  return collected.some(c => c.animalId === animalId);
}
