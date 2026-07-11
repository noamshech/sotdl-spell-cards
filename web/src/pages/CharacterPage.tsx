import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AttributeCard } from '../components/AttributeCard'
import {
  IconAlert,
  IconCheck,
  IconDice,
  IconFlame,
  IconHeart,
  IconLeaf,
  IconMoon,
  IconRest,
  IconShield,
  IconSpark,
  IconSword,
  IconUser,
} from '../components/Icons'
import { Stepper } from '../components/Stepper'
import { useCharacter } from '../context/CharacterContext'
import { ANCESTRIES, type AncestryPreset } from '../data/ancestries'
import { AFFLICTIONS } from '../data/afflictions'
import {
  EXPERT_SUGGESTIONS,
  LEVEL_STEPS,
  MASTER_SUGGESTIONS,
  NOVICE_SUGGESTIONS,
} from '../data/levelUp'
import { REVISED_RULES_NOTES } from '../data/revisedRules'
import {
  derivedDefense,
  derivedHealth,
  derivedHealingRate,
  derivedPerception,
  formatMod,
} from '../types'

const ANCESTRY_ICONS: Record<string, typeof IconUser> = {
  Human: IconUser,
  Changeling: IconMoon,
  Clockwork: IconDice,
  Dwarf: IconShield,
  Goblin: IconLeaf,
  Orc: IconFlame,
}

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
  const [humanBoost, setHumanBoost] = useState<string>('strength')

  function showToast(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
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
  const nextStep = LEVEL_STEPS.find((s) => s.level === active.level + 1)

  function applyAncestry(preset: AncestryPreset) {
    const scores = {
      strength: preset.strength,
      agility: preset.agility,
      intellect: preset.intellect,
      will: preset.will,
    }
    if (preset.name === 'Human') {
      const key = humanBoost as keyof typeof scores
      scores[key] = scores[key] + 1
    }
    updateActive({
      ancestry: preset.name,
      ...scores,
      perceptionBonus: preset.perceptionBonus,
      healthBonus: preset.healthBonus,
      defenseOverride: preset.defenseOverride,
      size: preset.size,
      speed: preset.speed,
      power: preset.power,
      insanity: preset.insanity,
      corruption: preset.corruption,
      damage: 0,
      description: [preset.notes, preset.languages].filter(Boolean).join('\n\n'),
    })
    showToast(`${preset.name} preset applied`)
  }

  function toggleAffliction(id: string) {
    if (!active) return
    const has = active.afflictions.includes(id)
    updateActive({
      afflictions: has
        ? active.afflictions.filter((a) => a !== id)
        : [...active.afflictions, id],
    })
  }

  function setLevel(level: number) {
    updateActive({ level: Math.max(0, Math.min(10, level)) })
  }

  return (
    <>
      <section className="panel sheet-panel">
        <div className="sheet-topbar">
          <div className="field field-grow">
            <label htmlFor="active">
              <IconUser size={12} /> Character
            </label>
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
              onChange={(e) => setLevel(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Ancestry presets */}
        <div className="preset-block">
          <div className="preset-head">
            <h3 className="section-heading" style={{ margin: 0 }}>
              <IconDice size={16} /> Ancestry presets
            </h3>
            <p className="muted intro-line" style={{ margin: 0 }}>
              One tap fills starting scores from the core book.
            </p>
          </div>
          <div className="human-boost">
            <span className="strip-label">Human +1 to</span>
            {(['strength', 'agility', 'intellect', 'will'] as const).map((k) => (
              <label key={k} className={`filter-chip${humanBoost === k ? ' on' : ''}`}>
                <input
                  type="radio"
                  name="humanBoost"
                  checked={humanBoost === k}
                  onChange={() => setHumanBoost(k)}
                />
                <span className="filter-chip-label">{k.slice(0, 3)}</span>
              </label>
            ))}
          </div>
          <div className="preset-grid">
            {ANCESTRIES.map((a) => {
              const Icon = ANCESTRY_ICONS[a.name] ?? IconUser
              const selected = active.ancestry === a.name
              return (
                <button
                  key={a.name}
                  type="button"
                  className={`preset-card${selected ? ' on' : ''}`}
                  onClick={() => applyAncestry(a)}
                  title={a.notes}
                >
                  <Icon size={18} />
                  <strong>{a.name}</strong>
                  <span>
                    S{a.strength} A{a.agility} I{a.intellect} W{a.will}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="sheet-paths">
          <div className="field">
            <label htmlFor="novice">Novice</label>
            <input
              id="novice"
              list="novice-list"
              value={active.novicePath}
              onChange={(e) => updateActive({ novicePath: e.target.value })}
              placeholder="Magician, Warrior…"
            />
            <datalist id="novice-list">
              {NOVICE_SUGGESTIONS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>
          <div className="field">
            <label htmlFor="expert">Expert</label>
            <input
              id="expert"
              list="expert-list"
              value={active.expertPath}
              onChange={(e) => updateActive({ expertPath: e.target.value })}
            />
            <datalist id="expert-list">
              {EXPERT_SUGGESTIONS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>
          <div className="field">
            <label htmlFor="master">Master</label>
            <input
              id="master"
              list="master-list"
              value={active.masterPath}
              onChange={(e) => updateActive({ masterPath: e.target.value })}
            />
            <datalist id="master-list">
              {MASTER_SUGGESTIONS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
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

        {/* Level-up helper */}
        <div className="levelup-card">
          <div className="levelup-head">
            <h3 className="section-heading" style={{ margin: 0 }}>
              <IconCheck size={16} /> Level-up helper
            </h3>
            <div className="btn-row">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={active.level <= 0}
                onClick={() => setLevel(active.level - 1)}
              >
                −
              </button>
              <span className="level-badge">Lvl {active.level}</span>
              <button
                type="button"
                className="btn btn-primary"
                disabled={active.level >= 10}
                onClick={() => {
                  const next = Math.min(10, active.level + 1)
                  setLevel(next)
                  const step = LEVEL_STEPS.find((s) => s.level === next)
                  showToast(step ? `Level ${next}: ${step.title}` : `Now level ${next}`)
                }}
              >
                Level up
              </button>
            </div>
          </div>
          {nextStep ? (
            <p className="levelup-next">
              <strong>Next (lvl {nextStep.level}):</strong> {nextStep.title} — {nextStep.detail}
            </p>
          ) : (
            <p className="levelup-next muted">You have reached level 10.</p>
          )}
          <ol className="levelup-list">
            {LEVEL_STEPS.map((step) => (
              <li
                key={step.level}
                className={
                  step.level < active.level
                    ? 'done'
                    : step.level === active.level
                      ? 'current'
                      : ''
                }
              >
                <span className="lvl-num">{step.level}</span>
                <span>
                  <strong>{step.title}</strong>
                  <em>{step.detail}</em>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <h3 className="section-heading">
          <IconSword size={16} /> Attributes
        </h3>
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

        <h3 className="section-heading">
          <IconHeart size={16} /> Vitals
        </h3>
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
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => updateActive({ damage: Math.max(0, active.damage - healing) })}
              >
                <IconRest size={14} /> Heal {healing}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => updateActive({ damage: 0 })}
              >
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
          <p className="rules-note" title={REVISED_RULES_NOTES.insanity.body}>
            <IconMoon size={13} /> <strong>{REVISED_RULES_NOTES.edition}:</strong>{' '}
            {REVISED_RULES_NOTES.insanity.body}
          </p>

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

        {/* Afflictions */}
        <h3 className="section-heading">
          <IconAlert size={16} /> Afflictions
        </h3>
        <p className="muted intro-line">Tap to toggle. Active ones also show on the combat strip.</p>
        <div className="affliction-grid">
          {AFFLICTIONS.map((a) => {
            const on = active.afflictions.includes(a.id)
            return (
              <button
                key={a.id}
                type="button"
                className={`affliction-chip${on ? ' on' : ''}`}
                title={a.summary}
                onClick={() => toggleAffliction(a.id)}
              >
                <strong>{a.name}</strong>
                <span>{a.summary}</span>
              </button>
            )
          })}
        </div>

        <h3 className="section-heading">
          <IconSpark size={16} /> Magic
        </h3>
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
            <IconSpark size={14} /> Open Grimoire
          </Link>
        </div>

        <div className="notes-grid">
          <div className="field">
            <label htmlFor="talents">Talents</label>
            <textarea
              id="talents"
              rows={3}
              value={active.talents}
              onChange={(e) => updateActive({ talents: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="weapons">Weapons</label>
            <textarea
              id="weapons"
              rows={3}
              value={active.weapons}
              onChange={(e) => updateActive({ weapons: e.target.value })}
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
