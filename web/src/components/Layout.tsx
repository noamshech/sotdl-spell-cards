import { NavLink, Outlet } from 'react-router-dom'
import { CombatStrip } from './CombatStrip'
import { IconBook, IconSpark, IconUser } from './Icons'

export function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <div className="brand-title">Hearth &amp; Hex</div>
          <div className="brand-sub">Shadow of the Demon Lord spell grimoire</div>
        </div>
        <nav className="nav" aria-label="Main">
          <NavLink to="/" end>
            <IconBook size={15} />
            Library
          </NavLink>
          <NavLink to="/grimoire">
            <IconSpark size={15} />
            Grimoire
          </NavLink>
          <NavLink to="/character">
            <IconUser size={15} />
            Character
          </NavLink>
        </nav>
      </header>
      <CombatStrip />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
