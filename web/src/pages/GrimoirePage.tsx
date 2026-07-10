import { useMemo, useState } from 'react'
import { CastingPips } from '../components/CastingPips'
import { SpellModal } from '../components/SpellModal'
import { useCharacter } from '../context/CharacterContext'
import { findSpell, useSpells } from '../hooks/useSpells'
import type { Spell } from '../types'
import { imageUrl, spellId } from '../types'

export function GrimoirePage() {
  const { active, castSpell, restoreCasting, rest, forgetSpell, abandonTradition } = useCharacter()
  const { spells, loading } = useSpells()
  const [selected, setSelected] = useState<Spell | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [traditionFilter, setTraditionFilter] = useState('')

  const known = useMemo(() => {
    if (!active) return []
    return active.knownSpells
      .map((id) => findSpell(spells, id))
      .filter((s): s is Spell => Boolean(s))
      .filter((s) => !traditionFilter || s.tradition === traditionFilter)
      .sort((a, b) => {
        const t = a.tradition.localeCompare(b.tradition)
        if (t) return t
        return Number(a.spell_level) - Number(b.spell_level) || a.name.localeCompare(b.name)
      })
  }, [active, spells, traditionFilter])

  function showToast(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  if (loading) return <div className="panel empty">Warming the grimoire…</div>
  if (!active) return <div className="panel empty">Create a character first.</div>

  return (
    <>
      <section className="panel">
        <div className="stat-row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h2 className="panel-title" style={{ marginBottom: 0 }}>
              {active.name}&apos;s Grimoire
            </h2>
            <p className="muted" style={{ margin: '0.35rem 0 0' }}>
              Power {active.power} · {active.traditions.length} traditions ·{' '}
              {active.knownSpells.length} spells known
            </p>
          </div>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                rest()
                showToast('You complete a rest. All castings restored.')
              }}
            >
              Rest &amp; recover
            </button>
          </div>
        </div>

        <div className="field" style={{ maxWidth: 220, marginBottom: '1rem' }}>
          <label htmlFor="g-trad">Tradition</label>
          <select
            id="g-trad"
            value={traditionFilter}
            onChange={(e) => setTraditionFilter(e.target.value)}
          >
            <option value="">All known</option>
            {active.traditions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {!!active.traditions.length && (
          <div style={{ marginBottom: '1rem' }}>
            <div className="muted" style={{ marginBottom: '0.4rem', fontSize: '0.8rem' }}>
              Known traditions
            </div>
            <div className="chip-list">
              {active.traditions.map((t) => (
                <span className="chip" key={t}>
                  {t}
                  <button
                    type="button"
                    title={`Abandon ${t}`}
                    onClick={() => {
                      if (confirm(`Abandon ${t} and forget its spells?`)) {
                        abandonTradition(t)
                        showToast(`Abandoned ${t}`)
                      }
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {!known.length && (
          <div className="empty">
            No spells in the grimoire yet. Open the Library and learn a rank 0 spell to discover a
            tradition.
          </div>
        )}

        <div className="grimoire-list">
          {known.map((spell) => {
            const id = spellId(spell)
            const rank = Number(spell.spell_level)
            const used = active.expended[id] ?? 0
            return (
              <div className="grimoire-item" key={id}>
                <img
                  src={imageUrl(spell)}
                  alt=""
                  onClick={() => setSelected(spell)}
                  role="presentation"
                />
                <div>
                  <div className="spell-tile-name">{spell.name}</div>
                  <div className="spell-tile-sub">
                    {spell.tradition} · {spell.utility_or_attack} {rank}
                  </div>
                  <CastingPips power={active.power} rank={rank} used={used} />
                </div>
                <div className="btn-row">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      const err = castSpell(id, rank)
                      showToast(err ?? `Cast ${spell.name}`)
                    }}
                  >
                    Cast
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => restoreCasting(id)}
                  >
                    Undo
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      forgetSpell(id)
                      showToast(`Forgot ${spell.name}`)
                    }}
                  >
                    Forget
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {selected && (
        <SpellModal spell={selected} onClose={() => setSelected(null)} onToast={showToast} />
      )}
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
