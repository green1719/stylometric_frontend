import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logoutSucceeded } from '../features/auth/authSlice'
import { resetFilters } from '../features/filters/filtersSlice'
import { setInteractionBlocked } from '../features/ui/uiSlice'
import { logoutWithToken, readApiError } from '../shared/api/authApi'

type TabIconName = 'feed' | 'add' | 'grid' | 'login'

function TabIcon({ name }: { name: TabIconName }) {
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
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status, accessToken } = useAppSelector((state) => state.auth)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function logout() {
    if (!accessToken || isLoggingOut) return
    setIsLoggingOut(true)
    dispatch(setInteractionBlocked(true))
    try {
      await logoutWithToken(accessToken)
      localStorage.removeItem('stylometry_jwt')
      dispatch(logoutSucceeded())
      dispatch(resetFilters())
      navigate('/grid', { replace: true })
    } catch (error) {
      window.alert(readApiError(error, 'Не удалось выполнить выход.'))
    } finally {
      setIsLoggingOut(false)
      dispatch(setInteractionBlocked(false))
    }
  }

  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      <NavLink to="/feed" className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`} aria-label="Лента"><TabIcon name="feed" /><span>Лента</span></NavLink>
      {status === 'authenticated'
        ? <NavLink to="/add" className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`} aria-label="Добавить"><TabIcon name="add" /><span>Добавить</span></NavLink>
        : <span className="nav-item nav-item--disabled" aria-disabled="true" title="Добавление доступно после входа"><TabIcon name="add" /><span>Добавить</span></span>}
      <NavLink to="/grid" className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`} aria-label="Плитка"><TabIcon name="grid" /><span>Плитка</span></NavLink>
      {status === 'authenticated'
        ? <button type="button" className="nav-item nav-item--button" onClick={() => void logout()} disabled={isLoggingOut} aria-label="Выход"><TabIcon name="login" /><span>{isLoggingOut ? 'Выход…' : 'Выход'}</span></button>
        : <NavLink to="/login" className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`} aria-label="Вход"><TabIcon name="login" /><span>Вход</span></NavLink>}
    </nav>
  )
}
