export type AfflictionDef = {
  id: string
  name: string
  summary: string
}

export const AFFLICTIONS: AfflictionDef[] = [
  { id: 'asleep', name: 'Asleep', summary: 'Prone and unconscious; can be woken; damage usually removes it.' },
  { id: 'blinded', name: 'Blinded', summary: 'Cannot see; attacks vs you gain 1 boon; Speed becomes 2 unless lower.' },
  { id: 'charmed', name: 'Charmed', summary: 'Sees the source as a friend; cannot attack that creature.' },
  { id: 'compelled', name: 'Compelled', summary: 'Controller forces a move or action each fast turn.' },
  { id: 'dazed', name: 'Dazed', summary: 'Cannot use actions.' },
  { id: 'deafened', name: 'Deafened', summary: 'Cannot hear; listen Perception challenges fail.' },
  { id: 'defenseless', name: 'Defenseless', summary: 'Defense 5; cannot use actions; attribute challenges fail.' },
  { id: 'diseased', name: 'Diseased', summary: 'Attack and challenge rolls with 1 bane.' },
  { id: 'fatigued', name: 'Fatigued', summary: 'Attack and challenge rolls with 1 bane.' },
  { id: 'frightened', name: 'Frightened', summary: '2019 Revised: Attack and challenge rolls with 1 bane, or 3 banes while you can see the source. (No longer restricts when you can act.)' },
  { id: 'grabbed', name: 'Grabbed', summary: 'May be unable to move away until the grab ends.' },
  { id: 'immobilized', name: 'Immobilized', summary: 'Speed 0; attacks against you gain 1 boon.' },
  { id: 'impaired', name: 'Impaired', summary: 'Attack and challenge rolls with 1 bane.' },
  { id: 'poisoned', name: 'Poisoned', summary: 'Attack and challenge rolls with 1 bane.' },
  { id: 'prone', name: 'Prone', summary: 'On the ground; crawl or stand; melee vs you gains 1 boon.' },
  { id: 'slowed', name: 'Slowed', summary: 'Only slow turns; Speed halved.' },
  { id: 'stunned', name: 'Stunned', summary: 'Cannot move or act; challenges fail; attacks gain 1 boon.' },
  { id: 'surprised', name: 'Surprised', summary: 'Cannot act or move; challenge rolls fail.' },
  { id: 'unconscious', name: 'Unconscious', summary: 'Cannot act, move, or perceive; Defense 5.' },
]

export const AFFLICTION_BY_ID = Object.fromEntries(AFFLICTIONS.map((a) => [a.id, a]))
