import { useEffect, useMemo, useState } from 'react'
import { IconBook } from '../components/Icons'
import { FilterCheckboxGroup } from '../components/FilterCheckboxGroup'
import { SpellModal } from '../components/SpellModal'
import { SpellTile } from '../components/SpellTile'
import { useSpells } from '../hooks/useSpells'
import type { Spell } from '../types'

type FilterKey = 'traditions' | 'attributes' | 'kinds' | 'ranks' | 'dark' | 'books'

type Filters = Record<FilterKey, string[]>

const EMPTY: Filters = {
  traditions: [],
  attributes: [],
  kinds: [],
  ranks: [],
  dark: [],
  books: [],
}

function matchesFilters(spell: Spell, filters: Filters, except?: FilterKey): boolean {
  if (except !== 'traditions' && filters.traditions.length && !filters.traditions.includes(spell.tradition)) {
    return false
  }
  if (except !== 'attributes' && filters.attributes.length && !filters.attributes.includes(spell.attribute)) {
    return false
  }
  if (except !== 'kinds' && filters.kinds.length && !filters.kinds.includes(spell.utility_or_attack)) {
    return false
  }
  if (except !== 'ranks' && filters.ranks.length && !filters.ranks.includes(spell.spell_level)) {
    return false
  }
  if (except !== 'dark' && filters.dark.length) {
    const isDark = spell.dark_magic === 'yes'
    const wantDark = filters.dark.includes('yes')
    const wantLight = filters.dark.includes('no')
    if (wantDark && wantLight) {
      // both selected = no restriction
    } else if (wantDark && !isDark) return false
    else if (wantLight && isDark) return false
  }
  if (except !== 'books' && filters.books.length && !filters.books.includes(spell.book)) {
    return false
  }
  return true
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  )
}

function prune(selected: string[], available: string[]): string[] {
  return selected.filter((v) => available.includes(v))
}

export function LibraryPage() {
  const { spells, loading, error } = useSpells()
  const [q, setQ] = useState('')
  const [filters, setFilters] = useState<Filters>(EMPTY)
  const [selected, setSelected] = useState<Spell | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const available = useMemo(() => {
    const pool = (except: FilterKey) => spells.filter((s) => matchesFilters(s, filters, except))
    return {
      traditions: uniqueSorted(pool('traditions').map((s) => s.tradition)),
      attributes: uniqueSorted(pool('attributes').map((s) => s.attribute)),
      kinds: uniqueSorted(pool('kinds').map((s) => s.utility_or_attack)),
      ranks: uniqueSorted(pool('ranks').map((s) => s.spell_level)),
      dark: uniqueSorted(
        pool('dark').map((s) => (s.dark_magic === 'yes' ? 'yes' : 'no')),
      ),
      books: uniqueSorted(pool('books').map((s) => s.book)),
    }
  }, [spells, filters])

  // Drop selections that are no longer possible given the other filters
  useEffect(() => {
    setFilters((prev) => {
      const next: Filters = {
        traditions: prune(prev.traditions, available.traditions),
        attributes: prune(prev.attributes, available.attributes),
        kinds: prune(prev.kinds, available.kinds),
        ranks: prune(prev.ranks, available.ranks),
        dark: prune(prev.dark, available.dark),
        books: prune(prev.books, available.books),
      }
      const changed = (Object.keys(next) as FilterKey[]).some(
        (k) => next[k].length !== prev[k].length || next[k].some((v, i) => v !== prev[k][i]),
      )
      return changed ? next : prev
    })
  }, [available])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return spells.filter((s) => {
      if (!matchesFilters(s, filters)) return false
      if (!query) return true
      const hay = [
        s.name,
        s.tradition,
        s.attribute,
        s.area,
        s.target,
        s.duration,
        s.requirement,
        s.description,
        s.utility_or_attack,
        s.book,
        s.page_number,
        s.spell_level,
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(query)
    })
  }, [spells, q, filters])

  const activeFilterCount = (Object.keys(filters) as FilterKey[]).reduce(
    (n, k) => n + filters[k].length,
    0,
  )

  function setFilter(key: FilterKey, values: string[]) {
    setFilters((prev) => ({ ...prev, [key]: values }))
  }

  function clearAll() {
    setFilters(EMPTY)
    setQ('')
  }

  function showToast(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  if (loading) return <div className="panel empty">Opening the library…</div>
  if (error) return <div className="panel empty">{error}</div>

  return (
    <>
      <section className="panel">
        <h2 className="panel-title">
          <IconBook size={18} /> Spell Library
        </h2>
        <p className="muted intro-line">
          Pick multiple filters — each choice narrows the other options, not only the cards.
        </p>

        <div className="field" style={{ marginBottom: '0.9rem' }}>
          <label htmlFor="q">Search</label>
          <input
            id="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. breeze, fire, short range, SHADOW…"
          />
        </div>

        <div className="filter-board">
          <div className="filter-board-top">
            <FilterCheckboxGroup
              label="Attribute"
              options={available.attributes}
              selected={filters.attributes}
              onChange={(v) => setFilter('attributes', v)}
            />
            <FilterCheckboxGroup
              label="Type"
              options={available.kinds}
              selected={filters.kinds}
              onChange={(v) => setFilter('kinds', v)}
              formatLabel={(v) => (v === 'ATTACK' ? 'Attack' : v === 'UTILITY' ? 'Utility' : v)}
            />
            <FilterCheckboxGroup
              label="Rank"
              options={available.ranks}
              selected={filters.ranks}
              onChange={(v) => setFilter('ranks', v)}
            />
            <FilterCheckboxGroup
              label="Dark magic"
              options={available.dark}
              selected={filters.dark}
              onChange={(v) => setFilter('dark', v)}
              formatLabel={(v) => (v === 'yes' ? 'Dark' : 'Non-dark')}
            />
            <FilterCheckboxGroup
              label="Book"
              options={available.books}
              selected={filters.books}
              onChange={(v) => setFilter('books', v)}
            />
          </div>
          <FilterCheckboxGroup
            label="Tradition"
            options={available.traditions}
            selected={filters.traditions}
            onChange={(v) => setFilter('traditions', v)}
            layout="wide"
          />
        </div>

        <div className="btn-row" style={{ margin: '0.75rem 0' }}>
          <p className="muted" style={{ margin: 0, flex: 1 }}>
            Showing {filtered.length} of {spells.length} spells
            {activeFilterCount > 0 ? ` · ${activeFilterCount} filter picks` : ''}
          </p>
          {(activeFilterCount > 0 || q) && (
            <button type="button" className="btn btn-ghost" onClick={clearAll}>
              Clear all filters
            </button>
          )}
        </div>

        <div className="spell-grid">
          {filtered.map((spell, i) => (
            <SpellTile
              key={`${spell.tradition}-${spell.name}`}
              spell={spell}
              onOpen={setSelected}
              style={{ animationDelay: `${Math.min(i, 24) * 0.02}s` }}
            />
          ))}
        </div>
        {!filtered.length && <div className="empty">No spells match these filters.</div>}
      </section>

      {selected && (
        <SpellModal spell={selected} onClose={() => setSelected(null)} onToast={showToast} />
      )}
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
