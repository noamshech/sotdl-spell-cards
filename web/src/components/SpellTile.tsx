import type { CSSProperties } from 'react'
import type { Spell } from '../types'
import { imageUrl } from '../types'

type Props = {
  spell: Spell
  onOpen: (spell: Spell) => void
  style?: CSSProperties
}

export function SpellTile({ spell, onOpen, style }: Props) {
  const rank = spell.spell_level
  const kind = spell.utility_or_attack
  return (
    <button type="button" className="spell-tile" style={style} onClick={() => onOpen(spell)}>
      <img src={imageUrl(spell)} alt={spell.name} loading="lazy" />
      <div className="spell-tile-meta">
        <div className="spell-tile-name">{spell.name}</div>
        <div className="spell-tile-sub">
          {spell.tradition} · {kind} {rank}
          {spell.dark_magic === 'yes' ? ' · dark' : ''}
        </div>
      </div>
    </button>
  )
}
