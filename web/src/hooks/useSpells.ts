import { useEffect, useState } from 'react'
import type { Spell } from '../types'

let cache: Spell[] | null = null

export function useSpells() {
  const [spells, setSpells] = useState<Spell[]>(cache ?? [])
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cache) return
    let cancelled = false
    fetch('./data/spells.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load spells')
        return r.json()
      })
      .then((data: Spell[]) => {
        if (cancelled) return
        cache = data
        setSpells(data)
        setLoading(false)
      })
      .catch((e: Error) => {
        if (cancelled) return
        setError(e.message)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { spells, loading, error }
}

export function findSpell(spells: Spell[], id: string): Spell | undefined {
  const [tradition, ...rest] = id.split('::')
  const name = rest.join('::')
  return spells.find((s) => s.tradition === tradition && s.name === name)
}
