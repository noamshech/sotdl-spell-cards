import type { AppState, Character } from '../types'

const KEY = 'hearth-hex-sotdl-v2'

function uid(): string {
  return crypto.randomUUID()
}

export function createCharacter(name = 'New Adventurer'): Character {
  return {
    id: uid(),
    name,
    ancestry: 'Human',
    level: 0,
    professions: '',
    description: '',
    novicePath: '',
    expertPath: '',
    masterPath: '',
    talents: '',
    strength: 10,
    agility: 10,
    intellect: 10,
    will: 10,
    perceptionBonus: 0,
    defenseOverride: null,
    healthBonus: 0,
    size: '1',
    speed: 10,
    power: 0,
    damage: 0,
    insanity: 0,
    corruption: 0,
    weapons: '',
    equipment: '',
    traditions: [],
    knownSpells: [],
    expended: {},
  }
}

function migrateCharacter(raw: Partial<Character> & { id?: string; name?: string }): Character {
  const base = createCharacter(raw.name || 'Adventurer')
  return {
    ...base,
    ...raw,
    id: raw.id || base.id,
    name: raw.name || base.name,
    ancestry: raw.ancestry ?? base.ancestry,
    level: Number(raw.level ?? base.level),
    professions: raw.professions ?? '',
    description: raw.description ?? '',
    novicePath: raw.novicePath ?? '',
    expertPath: raw.expertPath ?? '',
    masterPath: raw.masterPath ?? '',
    talents: raw.talents ?? '',
    strength: Number(raw.strength ?? 10),
    agility: Number(raw.agility ?? 10),
    intellect: Number(raw.intellect ?? 10),
    will: Number(raw.will ?? 10),
    perceptionBonus: Number(raw.perceptionBonus ?? 0),
    defenseOverride:
      raw.defenseOverride === undefined || raw.defenseOverride === null
        ? null
        : Number(raw.defenseOverride),
    healthBonus: Number(raw.healthBonus ?? 0),
    size: String(raw.size ?? '1'),
    speed: Number(raw.speed ?? 10),
    power: Number(raw.power ?? 0),
    damage: Number(raw.damage ?? 0),
    insanity: Number(raw.insanity ?? 0),
    corruption: Number(raw.corruption ?? 0),
    weapons: raw.weapons ?? '',
    equipment: raw.equipment ?? '',
    traditions: Array.isArray(raw.traditions) ? raw.traditions : [],
    knownSpells: Array.isArray(raw.knownSpells) ? raw.knownSpells : [],
    expended: raw.expended && typeof raw.expended === 'object' ? raw.expended : {},
  }
}

export function defaultState(): AppState {
  const c = createCharacter('My Caster')
  c.power = 1
  return { characters: [c], activeCharacterId: c.id }
}

function readLegacy(): AppState | null {
  try {
    const raw = localStorage.getItem('hearth-hex-sotdl-v1')
    if (!raw) return null
    const parsed = JSON.parse(raw) as AppState
    if (!parsed.characters?.length) return null
    return {
      characters: parsed.characters.map((c) => migrateCharacter(c)),
      activeCharacterId: parsed.activeCharacterId,
    }
  } catch {
    return null
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (!parsed.characters?.length) return defaultState()
      return {
        characters: parsed.characters.map((c) => migrateCharacter(c)),
        activeCharacterId: parsed.activeCharacterId,
      }
    }
    const legacy = readLegacy()
    if (legacy) {
      saveState(legacy)
      return legacy
    }
    return defaultState()
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function exportState(state: AppState): string {
  return JSON.stringify(state, null, 2)
}

export function importState(json: string): AppState {
  const parsed = JSON.parse(json) as AppState
  if (!parsed.characters || !Array.isArray(parsed.characters)) {
    throw new Error('Invalid save file')
  }
  return {
    characters: parsed.characters.map((c) => migrateCharacter(c)),
    activeCharacterId: parsed.activeCharacterId ?? parsed.characters[0]?.id ?? null,
  }
}
