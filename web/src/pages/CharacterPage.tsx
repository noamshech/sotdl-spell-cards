import { useRef, useState } from 'react'
import { maxCastings } from '../data/castings'
import { useCharacter } from '../context/CharacterContext'

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

  const castingPreview = [0, 1, 2, 3, 4, 5].map((rank) => ({
    rank,
    n: maxCastings(active.power, rank),
  }))

  return (
    <>
      <section className="panel">
        <h2 className="panel-title">Character</h2>
        <p className="muted intro-line">
          Saved in this browser only — free, private, no account. Export a backup anytime.
        </p>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="active">Active character</label>
            <select id="active" value={active.id} onChange={(e) => setActiveId(e.target.value)}>
              {state.characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Power {c.power})
                </option>
              ))}
            </select>
          </div>
          <div className="btn-row form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => addCharacter()}>
              New character
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

        <div className="form-grid form-grid-2">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={active.name}
              onChange={(e) => updateActive({ name: e.target.value })}
            />
          </div>
          <div className="field field-narrow">
            <label htmlFor="power">Power</label>
            <select
              id="power"
              value={active.power}
              onChange={(e) => updateActive({ power: Number(e.target.value) })}
            >
              {Array.from({ length: 11 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h3 className="section-heading">Castings at Power {active.power}</h3>
        <p className="muted intro-line">
          Castings are tracked <em>per known spell</em>, not as a shared pool. Resting restores all.
        </p>
        <div className="chip-list">
          {castingPreview.map(({ rank, n }) =>
            n > 0 ? (
              <span className="chip" key={rank}>
                Rank {rank}: {n}
              </span>
            ) : null,
          )}
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Backup</h2>
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
