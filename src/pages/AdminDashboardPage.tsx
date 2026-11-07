import { type FormEvent, useEffect, useState } from 'react'
import { adminApi } from '../api/adminApi'
import { parkingLotsApi } from '../api/parkingLotsApi'
import { getApiErrorMessage } from '../api/http'
import { useToast } from '../components/Toast'
import type { OccupancyStats, ParkingLot } from '../types/domain'

function todayInBogota(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export function AdminDashboardPage() {
  const toast = useToast()
  const [lots, setLots] = useState<ParkingLot[]>([])
  const [stats, setStats] = useState<OccupancyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    fechaInicio: todayInBogota(),
    fechaFin: todayInBogota(),
    parqueaderoId: '',
  })

  async function loadStats(next = filters) {
    setLoading(true)
    try {
      const data = await adminApi.occupancyStats({
        fechaInicio: next.fechaInicio || undefined,
        fechaFin: next.fechaFin || undefined,
        parqueaderoId: next.parqueaderoId || undefined,
      })
      setStats(data)
    } catch (err) {
      toast.push(getApiErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void (async () => {
      try {
        setLots(await parkingLotsApi.list())
      } catch {
        // El filtro de parqueaderos es opcional.
      }
      setLoading(true)
      try {
        const data = await adminApi.occupancyStats({
          fechaInicio: todayInBogota(),
          fechaFin: todayInBogota(),
        })
        setStats(data)
      } catch (err) {
        toast.push(getApiErrorMessage(err), 'error')
      } finally {
        setLoading(false)
      }
    })()
  }, [toast])

  function onFilter(event: FormEvent) {
    event.preventDefault()
    void loadStats(filters)
  }

  const maxHourly = Math.max(
    1,
    ...(stats?.volumenPorHora.map((h) => h.ingresos + h.reservas) ?? [1]),
  )

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h1>Métricas de ocupación</h1>
          <p>Indicadores administrativos en hora de Colombia.</p>
        </div>
      </header>

      <form className="form-panel" onSubmit={onFilter}>
        <div className="form-row">
          <label>
            Fecha inicio
            <input
              type="date"
              value={filters.fechaInicio}
              onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
            />
          </label>
          <label>
            Fecha fin
            <input
              type="date"
              value={filters.fechaFin}
              onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
            />
          </label>
        </div>
        <label>
          Parqueadero
          <select
            value={filters.parqueaderoId}
            onChange={(e) => setFilters({ ...filters, parqueaderoId: e.target.value })}
          >
            <option value="">Todos</option>
            {lots.map((lot) => (
              <option key={lot.id} value={lot.id}>
                {lot.name}
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn-primary" type="submit">
          Aplicar filtros
        </button>
      </form>

      {loading && <p className="muted">Cargando métricas…</p>}

      {stats && !loading && (
        <>
          <div className="metric-grid">
            <article className="metric">
              <h3>Total</h3>
              <p className="metric-value">{stats.total.porcentajeOcupacion.toFixed(1)}%</p>
              <p className="muted">
                {stats.total.ocupados}/{stats.total.capacidad}
              </p>
            </article>
            <article className="metric">
              <h3>Carros</h3>
              <p className="metric-value">{stats.carros.porcentajeOcupacion.toFixed(1)}%</p>
              <p className="muted">
                {stats.carros.ocupados}/{stats.carros.capacidad}
              </p>
            </article>
            <article className="metric">
              <h3>Motos</h3>
              <p className="metric-value">{stats.motos.porcentajeOcupacion.toFixed(1)}%</p>
              <p className="muted">
                {stats.motos.ocupados}/{stats.motos.capacidad}
              </p>
            </article>
            <article className="metric">
              <h3>Ingresos / Salidas</h3>
              <p className="metric-value">
                {stats.totalIngresos} / {stats.totalSalidas}
              </p>
              <p className="muted">
                Canceladas {stats.reservasCanceladas} · Expiradas {stats.reservasExpiradas}
              </p>
            </article>
          </div>

          <div className="form-panel">
            <h2>Distribución por rol</h2>
            <ul className="plain-list">
              {stats.distribucionPorRol.map((item) => (
                <li key={item.rol}>
                  <strong>{item.rol}</strong>: {item.reservas} reservas · {item.usosEfectivos} usos
                </li>
              ))}
            </ul>
          </div>

          <div className="form-panel">
            <h2>Volumen por hora</h2>
            <div className="bar-chart" role="img" aria-label="Volumen por hora">
              {stats.volumenPorHora.map((item) => {
                const total = item.ingresos + item.reservas
                const height = Math.max(8, Math.round((total / maxHourly) * 120))
                return (
                  <div key={item.hora} className="bar-col">
                    <div className="bar" style={{ height }} title={`${total}`} />
                    <span>{item.hora}</span>
                  </div>
                )
              })}
            </div>
            {stats.horasPico.length > 0 && (
              <p className="muted">
                Horas pico:{' '}
                {stats.horasPico.map((h) => `${h.hora}:00`).join(', ')}
              </p>
            )}
          </div>
        </>
      )}
    </section>
  )
}
