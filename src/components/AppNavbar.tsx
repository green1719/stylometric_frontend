import { NavLink } from 'react-router-dom'

const items = [
  { to: '/feed', label: 'Лента', icon: 'feed', enabled: true },
  { to: '#', label: 'Добавить', icon: 'add', enabled: false },
  { to: '/grid', label: 'Плитка', icon: 'grid', enabled: true },
  { to: '#', label: 'Вход', icon: 'login', enabled: false },
] as const

function TabIcon({ name }: { name: (typeof items)[number]['icon'] }) {
  return <span className={`nav-icon nav-icon--tab nav-icon--${name}`} aria-hidden="true">
    <svg viewBox="0 0 24 24">
      {name === 'feed' && <circle cx="12" cy="12" r="5.2" />}
      {name === 'add' && <><path d="M12 5v14" /><path d="M5 12h14" /></>}
      {name === 'grid' && <><rect x="4" y="4" width="4" height="4" /><rect x="10" y="4" width="4" height="4" /><rect x="16" y="4" width="4" height="4" /><rect x="4" y="10" width="4" height="4" /><rect x="10" y="10" width="4" height="4" /><rect x="16" y="10" width="4" height="4" /><rect x="4" y="16" width="4" height="4" /><rect x="10" y="16" width="4" height="4" /><rect x="16" y="16" width="4" height="4" /></>}
      {name === 'login' && <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20c.3-4 2.5-6 6.5-6s6.2 2 6.5 6" /></>}
    </svg>
  </span>
}

export function AppNavbar() {
  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      {items.map(({ to, label, icon, enabled }) =>
        enabled ? (
          <NavLink key={label} to={to} className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`} aria-label={label}>
            <TabIcon name={icon} />
            <span>{label}</span>
          </NavLink>
        ) : (
          <span key={label} className="nav-item nav-item--disabled" aria-disabled="true" title="Раздел пока недоступен">
            <TabIcon name={icon} />
            <span>{label}</span>
          </span>
        ),
      )}
    </nav>
  )
}
