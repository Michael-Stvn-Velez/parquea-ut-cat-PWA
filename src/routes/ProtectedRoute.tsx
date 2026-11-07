import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { UserRole } from '../types/domain'
import { homePathForRole } from '../auth/roles'

interface ProtectedRouteProps {
  roles?: UserRole[]
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { user, bootstrapping } = useAuth()
  const location = useLocation()

  if (bootstrapping) {
    return (
      <div className="boot-screen">
        <div className="spinner" aria-hidden />
        <p>Cargando sesión…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/403" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { user, bootstrapping } = useAuth()

  if (bootstrapping) {
    return (
      <div className="boot-screen">
        <div className="spinner" aria-hidden />
        <p>Cargando sesión…</p>
      </div>
    )
  }

  if (user) {
    return <Navigate to={homePathForRole(user.role)} replace />
  }

  return <Outlet />
}
