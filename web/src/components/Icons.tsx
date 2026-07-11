import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 18, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  )
}

export function IconBook(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </Svg>
  )
}

export function IconSpark(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      <circle cx="12" cy="12" r="3.5" />
    </Svg>
  )
}

export function IconUser(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19.5c1.8-3 4.2-4.5 7-4.5s5.2 1.5 7 4.5" />
    </Svg>
  )
}

export function IconShield(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    </Svg>
  )
}

export function IconHeart(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.8C19 15.6 12 20 12 20z" />
    </Svg>
  )
}

export function IconSword(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M14.5 4.5l5 5M12 7l-8.5 8.5 3 3L15 10" />
      <path d="M5 16l-2 5 5-2" />
    </Svg>
  )
}

export function IconMoon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M20 14.5A7.5 7.5 0 0 1 9.5 4 7 7 0 1 0 20 14.5z" />
    </Svg>
  )
}

export function IconSkull(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M8 15c.5 1.5 1.8 2.5 4 2.5s3.5-1 4-2.5" />
      <path d="M7 10a5 5 0 0 1 10 0v3.5c0 1.2-.5 2-1.5 2.5L15 20H9l-.5-4c-1-.5-1.5-1.3-1.5-2.5V10z" />
      <circle cx="9.5" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="11" r="1" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconFlame(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3c2 3 1 5 1 5s3-1 4 2 0 6-5 8c-5-2-6-5-5-8 1-3 3-4 5-7z" />
    </Svg>
  )
}

export function IconDice(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="9" cy="9" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="15" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1.2" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconZap(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M13 2L4 14h7l-1 8 10-14h-7l0-6z" />
    </Svg>
  )
}

export function IconEye(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </Svg>
  )
}

export function IconRest(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 19h16M6 16V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v7" />
      <path d="M9 7V5h6v2" />
    </Svg>
  )
}

export function IconPlus(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  )
}

export function IconCheck(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 13l4 4L19 7" />
    </Svg>
  )
}

export function IconAlert(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 4.2L2.8 18a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
    </Svg>
  )
}

export function IconTarget(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconLeaf(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 19c8 0 12-6 14-14-8 2-14 6-14 14z" />
      <path d="M5 19c3-3 6-5 9-7" />
    </Svg>
  )
}
