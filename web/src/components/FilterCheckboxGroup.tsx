type Props = {
  label: string
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
  formatLabel?: (value: string) => string
  columns?: number
}

export function FilterCheckboxGroup({
  label,
  options,
  selected,
  onChange,
  formatLabel = (v) => v,
  columns = 2,
}: Props) {
  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <fieldset className="filter-group">
      <legend>
        {label}
        {selected.length > 0 && <span className="filter-count">{selected.length}</span>}
      </legend>
      {options.length === 0 ? (
        <p className="filter-empty">No options with current filters</p>
      ) : (
        <div className="check-grid" style={{ ['--cols' as string]: columns }}>
          {options.map((opt) => {
            const id = `${label}-${opt}`
            const checked = selected.includes(opt)
            return (
              <label key={opt} className={`check-item${checked ? ' on' : ''}`} htmlFor={id}>
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt)}
                />
                <span>{formatLabel(opt)}</span>
              </label>
            )
          })}
        </div>
      )}
      {selected.length > 0 && (
        <button type="button" className="filter-clear" onClick={() => onChange([])}>
          Clear
        </button>
      )}
    </fieldset>
  )
}
