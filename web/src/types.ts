export type Spell = {
  tradition: string
  attribute: 'Intellect' | 'Will' | string
  dark_magic: string
  name: string
  area: string
  target: string
  duration: string
  requirement: string
  description: string
  utility_or_attack: string
  book: string
  page_number: string
  spell_level: string
  image_path: string
  source_pdf: string
  pdf_page: string
}

/** Full SotDL character — sheet + magic tracking */
export type Character = {
  id: string
  name: string
  ancestry: string
  level: number
  professions: string
  description: string
  novicePath: string
  expertPath: string
  masterPath: string
  talents: string
  strength: number
  agility: number
  intellect: number
  will: number
  /** Added to Intellect for Perception (ancestry, talents) */
  perceptionBonus: number
  /** null = Defense equals Agility (unarmored) */
  defenseOverride: number | null
  /** Added to Strength for Health */
  healthBonus: number
  size: string
  speed: number
  power: number
  damage: number
  insanity: number
  corruption: number
  weapons: string
  equipment: string
  traditions: string[]
  knownSpells: string[]
  expended: Record<string, number>
}

export type AppState = {
  characters: Character[]
  activeCharacterId: string | null
}

export function spellId(spell: Pick<Spell, 'tradition' | 'name'>): string {
  return `${spell.tradition}::${spell.name}`
}

export function imageUrl(spell: Spell): string {
  const file = spell.image_path.split(/[/\\]/).pop() ?? ''
  return `./images/${file}`
}

export function attrMod(score: number): number {
  return score - 10
}

export function formatMod(score: number): string {
  const m = attrMod(score)
  return m >= 0 ? `+${m}` : `${m}`
}

export function derivedPerception(c: Character): number {
  return c.intellect + (c.perceptionBonus || 0)
}

export function derivedDefense(c: Character): number {
  return c.defenseOverride ?? c.agility
}

export function derivedHealth(c: Character): number {
  return c.strength + (c.healthBonus || 0)
}

export function derivedHealingRate(c: Character): number {
  return Math.max(1, Math.floor(derivedHealth(c) / 4))
}
