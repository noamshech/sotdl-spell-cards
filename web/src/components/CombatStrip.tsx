import { AFFLICTION_BY_ID } from '../data/afflictions'
import { useCharacter } from '../context/CharacterContext'
import { derivedHealth } from '../types'
import { IconAlert, IconEye, IconSword, IconZap } from './Icons'

export function CombatStrip() {
  const { active, updateActive } = useCharacter()
  if (!active) return null

  const health = derivedHealth(active)
  const remaining = Math.max(0, health - active.damage)
  const activeAfflictions = active.afflictions
    .map((id) => AFFLICTION_BY_ID[id])
    .filter(Boolean)

  return (
    <aside className="combat-strip" aria-label="Combat strip">
      <div className="combat-strip-inner">
        <div className="combat-brand">
          <IconSword size={16} />
          <span>Combat</span>
        </div>

        <label className="combat-field">
          <IconZap size={14} />
          <span>Init</span>
          <input
            type="number"
            value={active.initiative}
            onChange={(e) => updateActive({ initiative: Number(e.target.value) || 0 })}
            aria-label="Initiative"
          />
        </label>

        <div className="combat-hp" title="Health remaining">
          <span className="combat-hp-val">
            {remaining}/{health}
          </span>
          <span className="combat-hp-label">HP</span>
        </div>

        <label className="combat-field combat-conc">
          <IconEye size={14} />
          <span>Focus</span>
          <input
            type="text"
            value={active.concentration}
            placeholder="Concentration…"
            onChange={(e) => updateActive({ concentration: e.target.value })}
            aria-label="Concentration"
          />
          {active.concentration ? (
            <button
              type="button"
              className="combat-clear"
              onClick={() => updateActive({ concentration: '' })}
              title="End concentration"
            >
              ×
            </button>
          ) : null}
        </label>

        <div className="combat-afflictions">
          <IconAlert size={14} />
          {activeAfflictions.length === 0 ? (
            <span className="combat-muted">No afflictions</span>
          ) : (
            activeAfflictions.map((a) => (
              <button
                key={a.id}
                type="button"
                className="combat-aff-chip"
                title={a.summary}
                onClick={() =>
                  updateActive({
                    afflictions: active.afflictions.filter((id) => id !== a.id),
                  })
                }
              >
                {a.name} ×
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  )
}
