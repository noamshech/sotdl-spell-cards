type Props = {
  label: string
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
  formatLabel?: (value: string) => string
  /** wide = full-width wrapping chips (traditions); compact = smaller groups */
  layout?: 'wide' | 'compact'
}

export function FilterCheckboxGroup({
  label,
  options,
  selected,
  onChange,
  formatLabel = (v) => v,
  layout = 'compact',
}: Props) {
  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <fieldset className={`filter-group filter-group--${layout}`}>
      <legend>
        {label}
        {selected.length > 0 && <span className="filter-count">{selected.length}</span>}
      </legend>

      {selected.length > 0 && (
        <button type="button" className="filter-clear" onClick={() => onChange([])}>
          Clear
        </button>
      )}

      {options.length === 0 ? (
        <p className="filter-empty">No options with current filters</p>
      ) : (
        <div className="chip-filters" role="group" aria-label={label}>
          {options.map((opt) => {
            const id = `${label}-${opt}`.replace(/\s+/g, '-')
            const checked = selected.includes(opt)
            return (
              <label key={opt} className={`filter-chip${checked ? ' on' : ''}`} htmlFor={id}>
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt)}
                />
                <span className="filter-chip-label">{formatLabel(opt)}</span>
              </label>
            )
          })}
        </div>
      )}
    </fieldset>
  )
}
