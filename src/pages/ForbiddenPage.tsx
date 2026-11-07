import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { homePathForRole } from '../auth/roles'

export function ForbiddenPage() {
  const { user } = useAuth()
  const home = user ? homePathForRole(user.role) : '/login'

  return (
    <div className="empty-state">
      <h1>403 · Acceso restringido</h1>
      <p>No tienes permiso para ver esta sección con tu rol actual.</p>
      <Link className="btn btn-primary" to={home}>
        Volver al inicio
      </Link>
    </div>
  )
}
