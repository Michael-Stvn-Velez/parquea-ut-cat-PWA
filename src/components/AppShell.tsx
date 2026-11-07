import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  canCreateReservations,
  canManageParkingLots,
  canOperateAccessControl,
  canViewAdminStats,
  roleLabel,
} from '../auth/roles'

function linkClass(isActive: boolean) {
  return isActive ? 'active' : undefined
}

export function AppShell() {
  const { user, logout } = useAuth()
  const location = useLocation()

  if (!user) return null

  const misReservasActive =
    location.pathname === '/reservas' ||
    (/^\/reservas\/[^/]+$/.test(location.pathname) &&
      location.pathname !== '/reservas/nueva')

  const parqueaderosActive =
    location.pathname === '/parqueaderos' ||
    (/^\/parqueaderos\/[^/]+$/.test(location.pathname) &&
      location.pathname !== '/parqueaderos/nuevo')

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden>
            P
          </span>
          <div>
            <p className="brand-name">Parquea UT CAT</p>
            <p className="brand-sub">
              {user.fullName} · {roleLabel(user.role)}
            </p>
          </div>
        </div>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          Cerrar sesión
        </button>
      </header>

      <nav className="nav-rail" aria-label="Principal">
        {canCreateReservations(user.role) && (
          <>
            <NavLink to="/reservas" className={() => linkClass(misReservasActive)} end>
              Mis reservas
            </NavLink>
            <NavLink to="/reservas/nueva" className={({ isActive }) => linkClass(isActive)}>
              Nueva reserva
            </NavLink>
          </>
        )}
        <NavLink to="/parqueaderos" className={() => linkClass(parqueaderosActive)} end>
          Parqueaderos
        </NavLink>
        {canOperateAccessControl(user.role) && (
          <NavLink to="/porteria" className={({ isActive }) => linkClass(isActive)}>
            Portería
          </NavLink>
        )}
        {canManageParkingLots(user.role) && (
          <NavLink
            to="/parqueaderos/nuevo"
            className={({ isActive }) => linkClass(isActive)}
          >
            Crear parqueadero
          </NavLink>
        )}
        {canViewAdminStats(user.role) && (
          <NavLink to="/admin" className={({ isActive }) => linkClass(isActive)}>
            Métricas
          </NavLink>
        )}
        <NavLink to="/perfil" className={({ isActive }) => linkClass(isActive)}>
          Perfil
        </NavLink>
        <NavLink to="/salud" className={({ isActive }) => linkClass(isActive)}>
          Salud API
        </NavLink>
      </nav>

      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}
