import { maxCastings } from '../data/castings'

type Props = {
  power: number
  rank: number
  used: number
}

export function CastingPips({ power, rank, used }: Props) {
  const max = maxCastings(power, rank)
  if (max <= 0) {
    return <div className="castings muted">Cannot cast at Power {power}</div>
  }
  return (
    <div className="castings" title={`${max - used} of ${max} castings remaining`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`pip${i < max - used ? ' filled' : ''}`} />
      ))}
      <span className="muted" style={{ fontSize: '0.8rem' }}>
        {max - used}/{max}
      </span>
    </div>
  )
}
