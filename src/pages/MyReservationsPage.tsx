import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { reservationsApi } from '../api/reservationsApi'
import { getApiErrorMessage } from '../api/http'
import type { Reservation, ReservationStatus } from '../types/domain'

const ALL = 'TODAS'

export function MyReservationsPage() {
  const [items, setItems] = useState<Reservation[]>([])
  const [filter, setFilter] = useState<ReservationStatus | typeof ALL>(ALL)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        setItems(await reservationsApi.myReservations())
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(
    () => (filter === ALL ? items : items.filter((r) => r.estado === filter)),
    [items, filter],
  )

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h1>Mis reservas</h1>
          <p>Historial y tickets digitales.</p>
        </div>
        <Link className="btn btn-primary" to="/reservas/nueva">
          Nueva reserva
        </Link>
      </header>

      <label className="inline-filter">
        Estado
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as ReservationStatus | typeof ALL)}
        >
          <option value={ALL}>Todas</option>
          <option value="CONFIRMADA">Confirmada</option>
          <option value="INGRESADO">Ingresado</option>
          <option value="FINALIZADA">Finalizada</option>
          <option value="CANCELADA">Cancelada</option>
          <option value="EXPIRADA">Expirada</option>
        </select>
      </label>

      {loading && <p className="muted">Cargando reservas…</p>}
      {error && <p className="banner banner-error">{error}</p>}
      {!loading && filtered.length === 0 && (
        <p className="empty-inline">No hay reservas para este filtro.</p>
      )}

      <div className="list-stack">
        {filtered.map((reservation) => (
          <Link
            key={reservation.id}
            to={`/reservas/${reservation.id}`}
            className="list-row"
          >
            <div>
              <strong>{reservation.ticketCode}</strong>
              <p className="muted">
                {reservation.nombreParqueadero} · {reservation.fecha} ·{' '}
                {reservation.horaInicio.slice(0, 5)}-{reservation.horaFin.slice(0, 5)}
              </p>
            </div>
            <span className={`badge badge-${reservation.estado.toLowerCase()}`}>
              {reservation.estado}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
