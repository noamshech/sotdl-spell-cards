import { formatMod } from '../types'

type Props = {
  name: string
  score: number
  onChange: (n: number) => void
  hint?: string
}

export function AttributeCard({ name, score, onChange, hint }: Props) {
  return (
    <div className="attr-card">
      <div className="attr-name">{name}</div>
      <div className="attr-score-row">
        <button
          type="button"
          className="stepper-btn"
          aria-label={`Decrease ${name}`}
          onClick={() => onChange(Math.max(1, score - 1))}
        >
          −
        </button>
        <input
          className="attr-score"
          type="number"
          min={1}
          max={25}
          value={score}
          onChange={(e) => onChange(Math.min(25, Math.max(1, Number(e.target.value) || 1)))}
          aria-label={`${name} score`}
        />
        <button
          type="button"
          className="stepper-btn"
          aria-label={`Increase ${name}`}
          onClick={() => onChange(Math.min(25, score + 1))}
        >
          +
        </button>
      </div>
      <div className="attr-mod">{formatMod(score)}</div>
      {hint && <div className="attr-hint">{hint}</div>}
    </div>
  )
}
