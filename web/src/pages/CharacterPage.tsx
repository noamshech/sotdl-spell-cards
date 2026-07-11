import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AttributeCard } from '../components/AttributeCard'
import { Stepper } from '../components/Stepper'
import { useCharacter } from '../context/CharacterContext'
import {
  derivedDefense,
  derivedHealth,
  derivedHealingRate,
  derivedPerception,
  formatMod,
} from '../types'

export function CharacterPage() {
  const {
    state,
    active,
    setActiveId,
    addCharacter,
    updateActive,
    deleteCharacter,
    exportJson,
    importJson,
  } = useCharacter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  function downloadSave() {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hearth-hex-save.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Save file downloaded')
  }

  function onImportFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importJson(String(reader.result))
        showToast('Save imported')
      } catch {
        showToast('Could not import that file')
      }
    }
    reader.readAsText(file)
  }

  if (!active) return null

  const health = derivedHealth(active)
  const healing = derivedHealingRate(active)
  const perception = derivedPerception(active)
  const defense = derivedDefense(active)
  const remaining = Math.max(0, health - active.damage)
  const damagePct = health > 0 ? Math.min(100, (active.damage / health) * 100) : 0

  function heal() {
    updateActive({ damage: Math.max(0, active!.damage - healing) })
  }

  function restHeal() {
    updateActive({ damage: 0 })
  }

  return (
    <>
      <section className="panel sheet-panel">
        <div className="sheet-topbar">
          <div className="field field-grow">
            <label htmlFor="active">Character</label>
            <select id="active" value={active.id} onChange={(e) => setActiveId(e.target.value)}>
              {state.characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="btn-row sheet-top-actions">
            <button type="button" className="btn btn-ghost" onClick={() => addCharacter()}>
              New
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                if (confirm(`Delete ${active.name}?`)) deleteCharacter(active.id)
              }}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Identity */}
        <div className="sheet-identity">
          <div className="field sheet-name-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={active.name}
              onChange={(e) => updateActive({ name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="ancestry">Ancestry</label>
            <input
              id="ancestry"
              value={active.ancestry}
              onChange={(e) => updateActive({ ancestry: e.target.value })}
              placeholder="Human, Dwarf…"
            />
          </div>
          <div className="field field-narrow">
            <label htmlFor="level">Level</label>
            <input
              id="level"
              type="number"
              min={0}
              max={10}
              value={active.level}
              onChange={(e) => updateActive({ level: Number(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="sheet-paths">
          <div className="field">
            <label htmlFor="novice">Novice</label>
            <input
              id="novice"
              value={active.novicePath}
              onChange={(e) => updateActive({ novicePath: e.target.value })}
              placeholder="Magician, Warrior…"
            />
          </div>
          <div className="field">
            <label htmlFor="expert">Expert</label>
            <input
              id="expert"
              value={active.expertPath}
              onChange={(e) => updateActive({ expertPath: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="master">Master</label>
            <input
              id="master"
              value={active.masterPath}
              onChange={(e) => updateActive({ masterPath: e.target.value })}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="professions">Professions</label>
          <input
            id="professions"
            value={active.professions}
            onChange={(e) => updateActive({ professions: e.target.value })}
            placeholder="Scholar, Soldier…"
          />
        </div>

        {/* Attributes */}
        <h3 className="section-heading">Attributes</h3>
        <div className="attr-grid">
          <AttributeCard
            name="Strength"
            score={active.strength}
            onChange={(n) => updateActive({ strength: n })}
            hint="→ Health"
          />
          <AttributeCard
            name="Agility"
            score={active.agility}
            onChange={(n) => updateActive({ agility: n })}
            hint="→ Defense"
          />
          <AttributeCard
            name="Intellect"
            score={active.intellect}
            onChange={(n) => updateActive({ intellect: n })}
            hint="→ Perception"
          />
          <AttributeCard
            name="Will"
            score={active.will}
            onChange={(n) => updateActive({ will: n })}
            hint="Magic / Insanity"
          />
        </div>

        {/* Vitals */}
        <h3 className="section-heading">Vitals</h3>
        <div className="vitals-card">
          <div className="health-block">
            <div className="health-labels">
              <span className="health-title">Health</span>
              <span className="health-numbers">
                {remaining} / {health}
                <span className="muted"> · heal {healing}</span>
              </span>
            </div>
            <div className="health-bar" aria-hidden>
              <div className="health-bar-fill" style={{ width: `${100 - damagePct}%` }} />
            </div>
            <div className="vitals-actions">
              <Stepper
                label="Damage"
                value={active.damage}
                min={0}
                max={health + 20}
                onChange={(n) => updateActive({ damage: n })}
              />
              <button type="button" className="btn btn-ghost" onClick={heal}>
                Heal {healing}
              </button>
              <button type="button" className="btn btn-primary" onClick={restHeal}>
                Clear damage
              </button>
            </div>
          </div>

          <div className="stat-pills">
            <div className="stat-pill">
              <span className="stat-pill-label">Perception</span>
              <span className="stat-pill-value">
                {perception} <small>({formatMod(perception)})</small>
              </span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill-label">Defense</span>
              <span className="stat-pill-value">{defense}</span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill-label">Speed</span>
              <input
                className="stat-pill-input"
                type="number"
                value={active.speed}
                onChange={(e) => updateActive({ speed: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="stat-pill">
              <span className="stat-pill-label">Size</span>
              <input
                className="stat-pill-input"
                value={active.size}
                onChange={(e) => updateActive({ size: e.target.value })}
              />
            </div>
            <div className="stat-pill">
              <span className="stat-pill-label">Power</span>
              <input
                className="stat-pill-input"
                type="number"
                min={0}
                max={10}
                value={active.power}
                onChange={(e) => updateActive({ power: Number(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="tracker-row">
            <Stepper
              label="Insanity"
              value={active.insanity}
              onChange={(n) => updateActive({ insanity: n })}
            />
            <Stepper
              label="Corruption"
              value={active.corruption}
              onChange={(n) => updateActive({ corruption: n })}
            />
          </div>

          <details className="sheet-advanced">
            <summary>Adjust derived bonuses</summary>
            <div className="advanced-grid">
              <div className="field">
                <label htmlFor="percBonus">Perception bonus</label>
                <input
                  id="percBonus"
                  type="number"
                  value={active.perceptionBonus}
                  onChange={(e) => updateActive({ perceptionBonus: Number(e.target.value) || 0 })}
                />
              </div>
              <div className="field">
                <label htmlFor="healthBonus">Health bonus</label>
                <input
                  id="healthBonus"
                  type="number"
                  value={active.healthBonus}
                  onChange={(e) => updateActive({ healthBonus: Number(e.target.value) || 0 })}
                />
              </div>
              <div className="field">
                <label htmlFor="defOverride">Defense override</label>
                <input
                  id="defOverride"
                  type="number"
                  placeholder={`Agility (${active.agility})`}
                  value={active.defenseOverride ?? ''}
                  onChange={(e) => {
                    const v = e.target.value
                    updateActive({ defenseOverride: v === '' ? null : Number(v) })
                  }}
                />
              </div>
            </div>
          </details>
        </div>

        {/* Magic */}
        <h3 className="section-heading">Magic</h3>
        <div className="magic-card">
          <p className="muted intro-line">
            Power {active.power} · {active.traditions.length} traditions ·{' '}
            {active.knownSpells.length} spells
          </p>
          {!!active.traditions.length && (
            <div className="chip-list" style={{ marginBottom: '0.65rem' }}>
              {active.traditions.map((t) => (
                <span className="chip" key={t}>
                  {t}
                </span>
              ))}
            </div>
          )}
          <Link to="/grimoire" className="btn btn-primary link-btn">
            Open Grimoire
          </Link>
        </div>

        {/* Notes */}
        <div className="notes-grid">
          <div className="field">
            <label htmlFor="talents">Talents</label>
            <textarea
              id="talents"
              rows={3}
              value={active.talents}
              onChange={(e) => updateActive({ talents: e.target.value })}
              placeholder="Path talents…"
            />
          </div>
          <div className="field">
            <label htmlFor="weapons">Weapons</label>
            <textarea
              id="weapons"
              rows={3}
              value={active.weapons}
              onChange={(e) => updateActive({ weapons: e.target.value })}
              placeholder="Sword · Strength · 2d6…"
            />
          </div>
          <div className="field">
            <label htmlFor="equipment">Equipment</label>
            <textarea
              id="equipment"
              rows={3}
              value={active.equipment}
              onChange={(e) => updateActive({ equipment: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="description">Notes</label>
            <textarea
              id="description"
              rows={3}
              value={active.description}
              onChange={(e) => updateActive({ description: e.target.value })}
              placeholder="Appearance, bonds, quirks…"
            />
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Backup</h2>
        <p className="muted intro-line">Saved in this browser only. Export to move devices.</p>
        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={downloadSave}>
            Export save
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
            Import save
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImportFile(f)
              e.target.value = ''
            }}
          />
        </div>
      </section>

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
