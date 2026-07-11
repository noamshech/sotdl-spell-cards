type Props = {
  label: string
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
}

export function Stepper({ label, value, onChange, min = 0, max = 99 }: Props) {
  return (
    <div className="stepper">
      <span className="stepper-label">{label}</span>
      <div className="stepper-controls">
        <button
          type="button"
          className="stepper-btn"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          −
        </button>
        <span className="stepper-value">{value}</span>
        <button
          type="button"
          className="stepper-btn"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  )
}
