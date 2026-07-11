export type LevelStep = {
  level: number
  title: string
  detail: string
  kind: 'novice' | 'expert' | 'master' | 'ancestry' | 'path'
}

export const LEVEL_STEPS: LevelStep[] = [
  { level: 1, title: 'Choose Novice path', detail: 'Pick Magician, Priest, Rogue, or Warrior (or another novice). Gain level 1 benefits.', kind: 'novice' },
  { level: 2, title: 'Novice benefits', detail: 'Gain your novice path’s level 2 benefits.', kind: 'path' },
  { level: 3, title: 'Choose Expert path', detail: 'Pick an expert path. Gain its level 3 benefits.', kind: 'expert' },
  { level: 4, title: 'Ancestry benefits', detail: 'Gain your ancestry’s level 4 benefit (often Health + spell or a talent).', kind: 'ancestry' },
  { level: 5, title: 'Novice benefits', detail: 'Gain your novice path’s level 5 benefits.', kind: 'path' },
  { level: 6, title: 'Expert benefits', detail: 'Gain your expert path’s level 6 benefits.', kind: 'path' },
  { level: 7, title: 'Choose Master path', detail: 'Pick a master path. Gain its level 7 benefits.', kind: 'master' },
  { level: 8, title: 'Novice benefits', detail: 'Gain your novice path’s level 8 benefits.', kind: 'path' },
  { level: 9, title: 'Expert benefits', detail: 'Gain your expert path’s level 9 benefits.', kind: 'path' },
  { level: 10, title: 'Master benefits', detail: 'Gain your master path’s level 10 benefits.', kind: 'path' },
]

export const NOVICE_SUGGESTIONS = ['Magician', 'Priest', 'Rogue', 'Warrior']
export const EXPERT_SUGGESTIONS = [
  'Wizard',
  'Cleric',
  'Oracle',
  'Witch',
  'Scout',
  'Assassin',
  'Fighter',
  'Paladin',
  'Ranger',
  'Artificer',
]
export const MASTER_SUGGESTIONS = [
  'Archmage',
  'Beastmaster',
  'Dervish',
  'Gunslinger',
  'Inquisitor',
  'Shaman',
  'Spellbinder',
  'Titan',
  'Zealot',
]
