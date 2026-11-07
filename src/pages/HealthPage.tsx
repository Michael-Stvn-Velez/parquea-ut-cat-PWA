import { useEffect, useState } from 'react'
import { healthApi } from '../api/healthApi'
import { getApiErrorMessage } from '../api/http'
import type { HealthResponse } from '../types/domain'

export function HealthPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await healthApi.check()
      setHealth(data)
    } catch (err) {
      setHealth(null)
      setError(getApiErrorMessage(err, 'No se pudo consultar el health check.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h1>Salud de la API</h1>
          <p>Comprueba la conexión real con MariaDB.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => void load()}>
          Actualizar
        </button>
      </header>

      {loading && <p className="muted">Consultando…</p>}
      {error && <p className="banner banner-error">{error}</p>}
      {health && (
        <div className={`status-pill ${health.isConnected ? 'ok' : 'bad'}`}>
          {health.isConnected ? 'Base de datos disponible' : 'Base de datos no disponible'}
          <span>
            Revisado:{' '}
            {new Date(health.checkedAtUtc).toLocaleString('es-CO', {
              timeZone: 'America/Bogota',
            })}
          </span>
        </div>
      )}
    </section>
  )
}
