import { useCharacter } from '../context/CharacterContext'
import { useSpells } from '../hooks/useSpells'
import type { Spell } from '../types'
import { imageUrl, spellId } from '../types'
import { CastingPips } from './CastingPips'

type Props = {
  spell: Spell
  onClose: () => void
  onToast: (msg: string) => void
}

export function SpellModal({ spell, onClose, onToast }: Props) {
  const { active, learnSpell, forgetSpell, castSpell, restoreCasting, discoverTradition } =
    useCharacter()
  const { spells } = useSpells()
  const id = spellId(spell)
  const rank = Number(spell.spell_level)
  const known = active?.knownSpells.includes(id) ?? false
  const discovered = active?.traditions.includes(spell.tradition) ?? false
  const used = active?.expended[id] ?? 0

  const rank0Known = Boolean(
    active &&
      spells.some(
        (s) =>
          s.tradition === spell.tradition &&
          Number(s.spell_level) === 0 &&
          active.knownSpells.includes(spellId(s)),
      ),
  )

  function onLearn() {
    if (!active) return
    if (!discovered) {
      if (rank !== 0) {
        onToast(`Discover ${spell.tradition} by learning its rank 0 spell first`)
        return
      }
      const err = discoverTradition(spell.tradition, id)
      onToast(err ?? `Discovered ${spell.tradition} and learned ${spell.name}`)
      return
    }
    if (rank > 0 && !rank0Known) {
      onToast(`Learn a rank 0 ${spell.tradition} spell before higher ranks`)
      return
    }
    const err = learnSpell(spell, rank0Known)
    onToast(err ?? `Learned ${spell.name}`)
  }

  function onCast() {
    const err = castSpell(id, rank)
    onToast(err ?? `Cast ${spell.name}`)
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={spell.name}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-art">
          <img src={imageUrl(spell)} alt="" />
        </div>
        <div className="modal-body">
          <h2>{spell.name}</h2>
          <div className="modal-meta">
            <span className="badge">{spell.tradition}</span>
            <span className="badge">{spell.attribute}</span>
            <span className={`badge ${spell.utility_or_attack === 'ATTACK' ? 'attack' : ''}`}>
              {spell.utility_or_attack} {rank}
            </span>
            {spell.dark_magic === 'yes' && <span className="badge dark">Dark magic</span>}
            {spell.book && (
              <span className="badge">
                {spell.book}
                {spell.page_number ? ` ${spell.page_number}` : ''}
              </span>
            )}
          </div>

          {spell.area && (
            <p className="detail-line">
              <strong>Area</strong> {spell.area}
            </p>
          )}
          {spell.target && (
            <p className="detail-line">
              <strong>Target</strong> {spell.target}
            </p>
          )}
          {spell.duration && (
            <p className="detail-line">
              <strong>Duration</strong> {spell.duration}
            </p>
          )}
          {spell.requirement && (
            <p className="detail-line">
              <strong>Requirement</strong> {spell.requirement}
            </p>
          )}
          <p className="description">{spell.description}</p>

          {active && known && (
            <>
              <CastingPips power={active.power} rank={rank} used={used} />
              <div className="btn-row modal-actions">
                <button type="button" className="btn btn-primary" onClick={onCast}>
                  Cast
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => restoreCasting(id)}>
                  Undo cast
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    forgetSpell(id)
                    onToast(`Forgot ${spell.name}`)
                  }}
                >
                  Forget
                </button>
              </div>
            </>
          )}

          {active && !known && (
            <div className="btn-row modal-actions">
              <button type="button" className="btn btn-primary" onClick={onLearn}>
                {!discovered && rank === 0
                  ? `Discover ${spell.tradition}`
                  : 'Learn spell'}
              </button>
            </div>
          )}

          <div className="btn-row modal-actions modal-actions-close">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
