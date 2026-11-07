import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { homePathForRole } from '../auth/roles'

export function HomeRedirect() {
  const { user, bootstrapping } = useAuth()

  if (bootstrapping) {
    return (
      <div className="boot-screen">
        <div className="spinner" aria-hidden />
        <p>Cargando…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={homePathForRole(user.role)} replace />
}
