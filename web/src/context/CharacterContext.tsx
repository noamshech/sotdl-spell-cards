import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { canLearnRank, maxCastings } from '../data/castings'
import {
  createCharacter,
  exportState,
  importState,
  loadState,
  saveState,
} from '../lib/storage'
import type { AppState, Character, Spell } from '../types'
import { spellId } from '../types'

type CharacterApi = {
  state: AppState
  active: Character | null
  setActiveId: (id: string) => void
  addCharacter: (name?: string) => void
  updateActive: (patch: Partial<Character>) => void
  deleteCharacter: (id: string) => void
  discoverTradition: (tradition: string, rank0SpellId: string) => string | null
  learnSpell: (spell: Spell, knowsTraditionRank0: boolean) => string | null
  forgetSpell: (id: string) => void
  abandonTradition: (tradition: string) => void
  castSpell: (id: string, rank: number) => string | null
  restoreCasting: (id: string) => void
  rest: () => void
  exportJson: () => string
  importJson: (json: string) => void
}

const Ctx = createContext<CharacterApi | null>(null)

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const active = useMemo(
    () => state.characters.find((c) => c.id === state.activeCharacterId) ?? null,
    [state],
  )

  const patchActive = useCallback((fn: (c: Character) => Character) => {
    setState((prev) => ({
      ...prev,
      characters: prev.characters.map((c) =>
        c.id === prev.activeCharacterId ? fn(c) : c,
      ),
    }))
  }, [])

  const api: CharacterApi = {
    state,
    active,
    setActiveId: (id) => setState((s) => ({ ...s, activeCharacterId: id })),
    addCharacter: (name) => {
      const c = createCharacter(name)
      setState((s) => ({
        characters: [...s.characters, c],
        activeCharacterId: c.id,
      }))
    },
    updateActive: (patch) => patchActive((c) => ({ ...c, ...patch })),
    deleteCharacter: (id) => {
      setState((s) => {
        const characters = s.characters.filter((c) => c.id !== id)
        if (!characters.length) {
          const c = createCharacter()
          return { characters: [c], activeCharacterId: c.id }
        }
        const activeCharacterId =
          s.activeCharacterId === id ? characters[0].id : s.activeCharacterId
        return { characters, activeCharacterId }
      })
    },
    discoverTradition: (tradition, rank0SpellId) => {
      if (!active) return 'No active character'
      if (active.traditions.includes(tradition)) return 'Already discovered'
      patchActive((c) => ({
        ...c,
        traditions: [...c.traditions, tradition].sort(),
        knownSpells: c.knownSpells.includes(rank0SpellId)
          ? c.knownSpells
          : [...c.knownSpells, rank0SpellId],
      }))
      return null
    },
    learnSpell: (spell, knowsTraditionRank0) => {
      if (!active) return 'No active character'
      const id = spellId(spell)
      const rank = Number(spell.spell_level)
      if (!active.traditions.includes(spell.tradition)) {
        return `Discover the ${spell.tradition} tradition first`
      }
      if (!canLearnRank(active.power, rank)) {
        return `Need Power ${rank} to learn rank ${rank} spells`
      }
      if (rank > 0 && !knowsTraditionRank0) {
        return `Learn the rank 0 spell from ${spell.tradition} first`
      }
      if (active.knownSpells.includes(id)) return 'Already known'
      patchActive((c) => ({ ...c, knownSpells: [...c.knownSpells, id] }))
      return null
    },
    forgetSpell: (id) => {
      patchActive((c) => {
        const expended = { ...c.expended }
        delete expended[id]
        return {
          ...c,
          knownSpells: c.knownSpells.filter((s) => s !== id),
          expended,
        }
      })
    },
    abandonTradition: (tradition) => {
      patchActive((c) => {
        const keep = c.knownSpells.filter((s) => !s.startsWith(`${tradition}::`))
        const expended = { ...c.expended }
        for (const key of Object.keys(expended)) {
          if (key.startsWith(`${tradition}::`)) delete expended[key]
        }
        return {
          ...c,
          traditions: c.traditions.filter((t) => t !== tradition),
          knownSpells: keep,
          expended,
        }
      })
    },
    castSpell: (id, rank) => {
      if (!active) return 'No active character'
      const max = maxCastings(active.power, rank)
      if (max <= 0) return 'Cannot cast this rank at your Power'
      const used = active.expended[id] ?? 0
      if (used >= max) return 'No castings left — rest to recover'
      patchActive((c) => ({
        ...c,
        expended: { ...c.expended, [id]: (c.expended[id] ?? 0) + 1 },
      }))
      return null
    },
    restoreCasting: (id) => {
      patchActive((c) => {
        const used = c.expended[id] ?? 0
        if (used <= 0) return c
        const expended = { ...c.expended }
        if (used === 1) delete expended[id]
        else expended[id] = used - 1
        return { ...c, expended }
      })
    },
    rest: () => patchActive((c) => ({ ...c, expended: {} })),
    exportJson: () => exportState(state),
    importJson: (json) => setState(importState(json)),
  }

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useCharacter(): CharacterApi {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCharacter outside provider')
  return ctx
}
