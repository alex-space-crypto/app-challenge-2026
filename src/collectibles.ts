export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AnimalInteraction {
  label: string;
  icon: string;
  response: string;
  reaction: string;
}

export interface CollectibleAnimal {
  id: string;
  name: string;
  emoji: string;
  rarity: Rarity;
  fact: string;
  habitat: string;
  interactions: AnimalInteraction[];
}

export const RARITY_INFO: Record<Rarity, { label: string; color: string; glow: string; weight: number; sound: string }> = {
  common:    { label: 'Common',    color: '#a0b8e0', glow: 'rgba(160,184,224,0.4)',  weight: 50, sound: 'sparkle' },
  rare:      { label: 'Rare',      color: '#3ba55d', glow: 'rgba(59,165,93,0.5)',    weight: 28, sound: 'chime' },
  epic:      { label: 'Epic',      color: '#f0a93b', glow: 'rgba(240,169,59,0.55)',  weight: 15, sound: 'fanfare' },
  legendary: { label: 'Legendary', color: '#ffd700', glow: 'rgba(255,215,0,0.6)',    weight: 7,  sound: 'legendary' },
};

export const ANIMALS: CollectibleAnimal[] = [
  // Common
  { id: 'squirrel',   name: 'Gray Squirrel',    emoji: '🐿️', rarity: 'common', fact: 'NC\'s state mammal, found in every county.', habitat: 'Forests & neighborhoods',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The squirrel nibbles your finger playfully!', reaction: 'happy' },
      { label: 'Feed',  icon: '🌰', response: 'It grabs an acorn and stuffs it in its cheeks!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'Chitter chitter! It flicks its tail and scampers up a tree.', reaction: 'bounce' },
    ] },
  { id: 'cardinal',   name: 'Northern Cardinal', emoji: '🐦', rarity: 'common', fact: 'The state bird of North Carolina!', habitat: 'Backyards & woodlands',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The cardinal tilts its head and lets you stroke its feathers.', reaction: 'happy' },
      { label: 'Feed',  icon: '🌾', response: 'It pecks up sunflower seeds one by one, singing between bites!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'Cheer cheer cheer! It sings back the NC state bird song!', reaction: 'bounce' },
    ] },
  { id: 'rabbit',     name: 'Eastern Cottontail', emoji: '🐰', rarity: 'common', fact: 'Can run up to 18 mph to escape predators.', habitat: 'Fields & meadows',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The rabbit closes its eyes and leans into your hand.', reaction: 'happy' },
      { label: 'Feed',  icon: '🥕', response: 'It munches a carrot with loud crunching sounds!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'Thump thump! It stamps its foot and wiggles its nose at you.', reaction: 'bounce' },
    ] },
  { id: 'turtle',     name: 'Box Turtle',         emoji: '🐢', rarity: 'common', fact: 'Can live over 100 years in the wild.', habitat: 'Forest floors & wetlands',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The turtle slowly pulls its head in, then peeks back out.', reaction: 'happy' },
      { label: 'Feed',  icon: '🥬', response: 'It takes a slow, deliberate bite of a leaf. Very chill.', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'It blinks slowly at you. Turtles are not impressed by volume.', reaction: 'bounce' },
    ] },
  { id: 'frog',       name: 'Green Frog',         emoji: '🐸', rarity: 'common', fact: 'Calls sound like a loose banjo string.', habitat: 'Ponds & streams',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The frog feels cool and slippery in your hand.', reaction: 'happy' },
      { label: 'Feed',  icon: '🦗', response: 'ZAP! Its tongue snags a fly in the blink of an eye!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'Gung-gung! It puffs its throat and calls like a banjo string.', reaction: 'bounce' },
    ] },
  { id: 'duck',       name: 'Mallard Duck',       emoji: '🦆', rarity: 'common', fact: 'Can sleep with one eye open to stay alert.', habitat: 'Lakes & rivers',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The duck wiggles its tail feathers happily!', reaction: 'happy' },
      { label: 'Feed',  icon: '🍞', response: 'It dabbles in the water for bread, quacking with joy!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'Quack quack quack! It paddles in a circle around you.', reaction: 'bounce' },
    ] },
  { id: 'deer',       name: 'White-tailed Deer',  emoji: '🦌', rarity: 'common', fact: 'Can leap up to 10 feet high!', habitat: 'Forests & fields',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The deer bows its head gently for a scratch behind the ears.', reaction: 'happy' },
      { label: 'Feed',  icon: '🍃', response: 'It delicately takes a leaf from your palm, chewing softly.', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'It raises its head alertly, ears swiveling, then bounds away gracefully.', reaction: 'bounce' },
    ] },
  { id: 'raccoon',    name: 'Raccoon',            emoji: '🦝', rarity: 'common', fact: 'Can remember solutions to tasks for 3 years.', habitat: 'Woods & near water',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The raccoon grabs your hand with its tiny paws and inspects it.', reaction: 'happy' },
      { label: 'Feed',  icon: '🍇', response: 'It washes the grape in a puddle before eating it. So polite!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'It chitters back and reaches toward your pockets curiously.', reaction: 'bounce' },
    ] },

  // Rare
  { id: 'fox',        name: 'Red Fox',            emoji: '🦊', rarity: 'rare', fact: 'Uses Earth\'s magnetic field to hunt prey.', habitat: 'Forest edges & fields',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The fox narrows its eyes slyly and lets you scratch its chin.', reaction: 'happy' },
      { label: 'Feed',  icon: '🍗', response: 'It catches the treat mid-air and trots off with a swish of its brush!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'Yip yip! It pricks its ears and vanishes into the tall grass.', reaction: 'bounce' },
    ] },
  { id: 'owl',        name: 'Barred Owl',         emoji: '🦉', rarity: 'rare', fact: 'Can rotate its head 270 degrees.', habitat: 'Swamps & old forests',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The owl blinks its huge golden eyes slowly. It trusts you.', reaction: 'happy' },
      { label: 'Feed',  icon: '🐭', response: 'It swivels its head 270 degrees, then gulps down a mouse whole!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'Who cooks for you? Who cooks for you-all? It hoots the barred owl call!', reaction: 'bounce' },
    ] },
  { id: 'beaver',     name: 'American Beaver',    emoji: '🦫', rarity: 'rare', fact: 'Engineers that build dams to create ponds.', habitat: 'Streams & rivers',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The beaver pauses its work and lets you feel its flat tail.', reaction: 'happy' },
      { label: 'Feed',  icon: '🪵', response: 'It grabs a stick and starts gnawing immediately — crunch crunch crunch!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'SLAP! It smacks its tail on the water and dives with a splash.', reaction: 'bounce' },
    ] },
  { id: 'otter',      name: 'River Otter',        emoji: '🦦', rarity: 'rare', fact: 'Can hold their breath underwater for 8 minutes.', habitat: 'Rivers & lakes',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The otter rolls onto its back and presents its belly for rubs!', reaction: 'happy' },
      { label: 'Feed',  icon: '🐟', response: 'It juggles a fish on its belly, tossing it up and catching it!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'Squeak squeak! It slides down the riverbank on its belly!', reaction: 'bounce' },
    ] },
  { id: 'skunk',      name: 'Striped Skunk',      emoji: '🦨', rarity: 'rare', fact: 'Can spray up to 15 feet with accuracy.', habitat: 'Edges of forests',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The skunk stomps its feet as a warning... but doesn\'t spray. You\'re safe!', reaction: 'happy' },
      { label: 'Feed',  icon: '🍓', response: 'It nibbles a berry delicately, tail held high.', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'It raises its tail and does a handstand warning dance!', reaction: 'bounce' },
    ] },
  { id: 'hedgehog',   name: 'Hedgehog',           emoji: '🦔', rarity: 'rare', fact: 'Has about 5,000 spines on its back.', habitat: 'Gardens & hedgerows',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'It curls into a spiky ball, then slowly uncurls to sniff you.', reaction: 'happy' },
      { label: 'Feed',  icon: '🐛', response: 'It snuffles along and hoover-ups a worm with its tiny nose!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'Snuffle snuffle! It waddles toward you with its quills flattened.', reaction: 'bounce' },
    ] },

  // Epic
  { id: 'eagle',      name: 'Bald Eagle',         emoji: '🦅', rarity: 'epic', fact: 'Can spot fish from 2 miles away!', habitat: 'Near large bodies of water',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The eagle grips your arm with powerful talons. Respect!', reaction: 'happy' },
      { label: 'Feed',  icon: '🐟', response: 'It swoops down and snatches a fish from mid-air!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'SKREEEE! It spreads its wings wide — a 7-foot wingspan!', reaction: 'bounce' },
    ] },
  { id: 'wolf',       name: 'Red Wolf',           emoji: '🐺', rarity: 'epic', fact: 'One of the most endangered wolves in the world.', habitat: 'Coastal prairies & forests',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The wolf presses its head against your leg, accepting you into the pack.', reaction: 'happy' },
      { label: 'Feed',  icon: '🥩', response: 'It tears into the meat and lets out a satisfied growl.', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'AAAOOOOO! It throws back its head and howls at the moon!', reaction: 'bounce' },
    ] },
  { id: 'bear',       name: 'Black Bear',         emoji: '🐻', rarity: 'epic', fact: 'Can smell food from 20 miles away.', habitat: 'Mountains & coastal forests',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The bear lets you rub its thick fur. It\'s surprisingly soft!', reaction: 'happy' },
      { label: 'Feed',  icon: '🍯', response: 'It laps up honey with a happy groan, getting it all over its snout!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'WOOF WOOF! Black bears don\'t roar — they make a loud huffing bark!', reaction: 'bounce' },
    ] },
  { id: 'butterfly',  name: 'Monarch Butterfly',  emoji: '🦋', rarity: 'epic', fact: 'Migrates up to 3,000 miles each year.', habitat: 'Meadows & gardens',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The butterfly lands on your finger and slowly opens and closes its wings.', reaction: 'happy' },
      { label: 'Feed',  icon: '🌼', response: 'It unrolls its proboscis and sips nectar from a flower in your hand.', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'It flutters in a spiral dance around your head, painting the air with orange.', reaction: 'bounce' },
    ] },
  { id: 'bat',        name: 'Big Brown Bat',      emoji: '🦇', rarity: 'epic', fact: 'Can eat 1,000 mosquitoes in one hour!', habitat: 'Caves & old buildings',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The bat hangs upside down and wraps its wings around your finger.', reaction: 'happy' },
      { label: 'Feed',  icon: '🦟', response: 'Echolocation clicks! It snags three mosquitoes in one second!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'It takes off in silent flight, looping through the twilight sky.', reaction: 'bounce' },
    ] },

  // Legendary
  { id: 'dragon',     name: 'Carolina Dragon',    emoji: '🐉', rarity: 'legendary', fact: 'A mythical guardian of the Neuse River.', habitat: 'Legend says deep in the swamps',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The dragon lowers its massive head. Its scales are warm like sun-baked stone.', reaction: 'happy' },
      { label: 'Feed',  icon: '🔮', response: 'It consumes a glowing crystal and breathes a plume of river-mist fire!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'ROOOAAAR! The Neuse River itself ripples in response to its call!', reaction: 'bounce' },
    ] },
  { id: 'unicorn',    name: 'Forest Unicorn',     emoji: '🦄', rarity: 'legendary', fact: 'Said to appear only to the most dedicated goal-trackers.', habitat: 'Ancient JoCo woodlands',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The unicorn bows its head and its spiral horn glows with soft light.', reaction: 'happy' },
      { label: 'Feed',  icon: '🌈', response: 'It eats a rainbow flower and sparkles drift from its mane like stardust!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'It rears up on its hind legs and gallops through a ring of wildflowers!', reaction: 'bounce' },
    ] },
  { id: 'phoenix',    name: 'Neuse Phoenix',      emoji: '🔥', rarity: 'legendary', fact: 'Rises from the Neuse River every 100 years.', habitat: 'River mist at dawn',
    interactions: [
      { label: 'Pet',   icon: '✋', response: 'The phoenix\'s feathers are warm but not burning. It coos softly.', reaction: 'happy' },
      { label: 'Feed',  icon: '☀️', response: 'It absorbs a sunbeam and its flames blaze brighter, scattering embers!', reaction: 'excited' },
      { label: 'Call',  icon: '🗣️', response: 'It bursts into a column of fire and is reborn from the ashes before your eyes!', reaction: 'bounce' },
    ] },
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
