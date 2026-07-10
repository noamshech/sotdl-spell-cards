import type { AppState, Character } from '../types'

const KEY = 'hearth-hex-sotdl-v1'

function uid(): string {
  return crypto.randomUUID()
}

export function createCharacter(name = 'New Caster'): Character {
  return {
    id: uid(),
    name,
    power: 1,
    traditions: [],
    knownSpells: [],
    expended: {},
  }
}

export function defaultState(): AppState {
  const c = createCharacter('My Caster')
  return { characters: [c], activeCharacterId: c.id }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as AppState
    if (!parsed.characters?.length) return defaultState()
    return parsed
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
  return parsed
}
