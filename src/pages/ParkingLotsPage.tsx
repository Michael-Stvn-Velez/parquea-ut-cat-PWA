import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { parkingLotsApi } from '../api/parkingLotsApi'
import { getApiErrorMessage } from '../api/http'
import { useAuth } from '../auth/AuthContext'
import { canManageParkingLots } from '../auth/roles'
import type { ParkingLot } from '../types/domain'

export function ParkingLotsPage() {
  const { user } = useAuth()
  const [lots, setLots] = useState<ParkingLot[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        setLots(await parkingLotsApi.list())
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h1>Parqueaderos</h1>
          <p>Capacidad y ocupación actual.</p>
        </div>
        {user && canManageParkingLots(user.role) && (
          <Link className="btn btn-primary" to="/parqueaderos/nuevo">
            Crear parqueadero
          </Link>
        )}
      </header>

      {loading && <p className="muted">Cargando parqueaderos…</p>}
      {error && <p className="banner banner-error">{error}</p>}
      {!loading && !error && lots.length === 0 && (
        <p className="empty-inline">No hay parqueaderos activos.</p>
      )}

      <div className="list-stack">
        {lots.map((lot) => {
          const carPct =
            lot.totalCarCapacity === 0
              ? 0
              : Math.round((lot.occupiedCarSpaces / lot.totalCarCapacity) * 100)
          const motoPct =
            lot.totalMotorcycleCapacity === 0
              ? 0
              : Math.round((lot.occupiedMotorcycleSpaces / lot.totalMotorcycleCapacity) * 100)

          return (
            <Link key={lot.id} to={`/parqueaderos/${lot.id}`} className="list-row">
              <div>
                <strong>{lot.name}</strong>
                <p className="muted">
                  Carros {lot.occupiedCarSpaces}/{lot.totalCarCapacity} · Motos{' '}
                  {lot.occupiedMotorcycleSpaces}/{lot.totalMotorcycleCapacity}
                </p>
              </div>
              <div className="mini-bars">
                <span>C {carPct}%</span>
                <span>M {motoPct}%</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
