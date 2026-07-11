import { NavLink, Outlet } from 'react-router-dom'

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
            Library
          </NavLink>
          <NavLink to="/grimoire">Grimoire</NavLink>
          <NavLink to="/character">Character</NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
