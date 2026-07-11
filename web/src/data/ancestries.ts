export type AncestryPreset = {
  name: string
  strength: number
  agility: number
  intellect: number
  will: number
  perceptionBonus: number
  healthBonus: number
  defenseOverride: number | null
  size: string
  speed: number
  power: number
  insanity: number
  corruption: number
  notes: string
  languages: string
}

export const ANCESTRIES: AncestryPreset[] = [
  {
    name: 'Human',
    strength: 10,
    agility: 10,
    intellect: 10,
    will: 10,
    perceptionBonus: 0,
    healthBonus: 0,
    defenseOverride: null,
    size: '1',
    speed: 10,
    power: 0,
    insanity: 0,
    corruption: 0,
    notes:
      'Choose one attribute and increase it by 1. Level 4: Health +5; learn one spell or Determined.',
    languages: 'Common Tongue; one extra language or a random profession.',
  },
  {
    name: 'Changeling',
    strength: 9,
    agility: 10,
    intellect: 10,
    will: 10,
    perceptionBonus: 1,
    healthBonus: 0,
    defenseOverride: null,
    size: '1',
    speed: 10,
    power: 0,
    insanity: 0,
    corruption: 0,
    notes:
      'Immune: disease damage; charmed, diseased. Iron Vulnerability. Shadowsight. Steal Identity. Level 4: Health +4.',
    languages: 'Common Tongue.',
  },
  {
    name: 'Clockwork',
    strength: 9,
    agility: 8,
    intellect: 9,
    will: 9,
    perceptionBonus: 0,
    healthBonus: 0,
    defenseOverride: 13,
    size: '1',
    speed: 8,
    power: 0,
    insanity: 0,
    corruption: 0,
    notes:
      'Construct with a key. Immune: disease/poison damage; asleep, diseased, fatigued, poisoned. Defense 13. Level 4: Health +5.',
    languages: 'Common Tongue.',
  },
  {
    name: 'Dwarf',
    strength: 10,
    agility: 9,
    intellect: 10,
    will: 10,
    perceptionBonus: 1,
    healthBonus: 4,
    defenseOverride: null,
    size: '1/2',
    speed: 8,
    power: 0,
    insanity: 0,
    corruption: 0,
    notes:
      'Darksight. Hated Creature. Robust Constitution. Level 4: Health +6; learn one spell or Shake it Off.',
    languages: 'Common Tongue; Dwarfish (speak, read, write).',
  },
  {
    name: 'Goblin',
    strength: 8,
    agility: 12,
    intellect: 10,
    will: 9,
    perceptionBonus: 1,
    healthBonus: 0,
    defenseOverride: null,
    size: '1/2',
    speed: 10,
    power: 0,
    insanity: 0,
    corruption: 0,
    notes:
      'Immune: disease damage; charmed, diseased. Iron Vulnerability. Shadowsight. Sneaky. Level 4: Health +4.',
    languages: 'Common Tongue and Elvish.',
  },
  {
    name: 'Orc',
    strength: 11,
    agility: 10,
    intellect: 9,
    will: 9,
    perceptionBonus: 1,
    healthBonus: 0,
    defenseOverride: null,
    size: '1',
    speed: 12,
    power: 0,
    insanity: 0,
    corruption: 1,
    notes: 'Shadowsight. Start with Corruption 1. Level 4: Health +6; learn one spell or Rising Fury.',
    languages: 'Common Tongue and Dark Speech.',
  },
]
