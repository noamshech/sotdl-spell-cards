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

export type Character = {
  id: string
  name: string
  power: number
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
