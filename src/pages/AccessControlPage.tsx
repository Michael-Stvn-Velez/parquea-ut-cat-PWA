import { type FormEvent, useEffect, useState } from 'react'
import { accessControlApi } from '../api/accessControlApi'
import { getApiErrorMessage } from '../api/http'
import { useToast } from '../components/Toast'
import type { ParkingAvailability, TicketVerification } from '../types/domain'

export function AccessControlPage() {
  const toast = useToast()
  const [codigo, setCodigo] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [verification, setVerification] = useState<TicketVerification | null>(null)
  const [availability, setAvailability] = useState<ParkingAvailability[]>([])
  const [busy, setBusy] = useState(false)

  async function loadAvailability() {
    try {
      setAvailability(await accessControlApi.availability())
    } catch (err) {
      toast.push(getApiErrorMessage(err), 'error')
    }
  }

  useEffect(() => {
    void (async () => {
      try {
        setAvailability(await accessControlApi.availability())
      } catch (err) {
        toast.push(getApiErrorMessage(err), 'error')
      }
    })()
  }, [toast])

  async function onVerify(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    try {
      const result = await accessControlApi.verify(codigo.trim())
      setVerification(result)
    } catch (err) {
      toast.push(getApiErrorMessage(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  async function onCheckIn() {
    setBusy(true)
    try {
      const result = await accessControlApi.checkIn(codigo.trim(), observaciones || null)
      toast.push(result.mensaje, 'success')
      setVerification(await accessControlApi.verify(codigo.trim()))
      await loadAvailability()
    } catch (err) {
      toast.push(getApiErrorMessage(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  async function onCheckOut() {
    setBusy(true)
    try {
      const result = await accessControlApi.checkOut(codigo.trim())
      toast.push(result.mensaje, 'success')
      setVerification(await accessControlApi.verify(codigo.trim()))
      await loadAvailability()
    } catch (err) {
      toast.push(getApiErrorMessage(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h1>Control de acceso</h1>
          <p>Verifica tickets y registra ingresos/salidas.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => void loadAvailability()}>
          Refrescar disponibilidad
        </button>
      </header>

      <form className="form-panel" onSubmit={onVerify}>
        <label>
          Código de ticket
          <input
            required
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="UT-..."
          />
        </label>
        <label>
          Observaciones (check-in)
          <textarea
            rows={3}
            maxLength={1000}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          Verificar ticket
        </button>
      </form>

      {verification && (
        <div className={`verify-panel estado-${verification.estado.toLowerCase()}`}>
          <p className="verify-status">{verification.estado}</p>
          <p>{verification.mensaje}</p>
          <dl className="detail-grid">
            <div>
              <dt>Usuario</dt>
              <dd>{verification.nombreUsuario ?? '—'}</dd>
            </div>
            <div>
              <dt>Rol</dt>
              <dd>{verification.rolUsuario ?? '—'}</dd>
            </div>
            <div>
              <dt>Placa</dt>
              <dd>{verification.placaVehiculo ?? '—'}</dd>
            </div>
            <div>
              <dt>Parqueadero</dt>
              <dd>{verification.nombreParqueadero ?? '—'}</dd>
            </div>
            <div>
              <dt>Horario</dt>
              <dd>
                {verification.fecha ?? '—'}{' '}
                {verification.horaInicio && verification.horaFin
                  ? `${verification.horaInicio.slice(0, 5)}-${verification.horaFin.slice(0, 5)}`
                  : ''}
              </dd>
            </div>
          </dl>
          <div className="actions-row">
            {verification.estado === 'VALIDO' && (
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy}
                onClick={() => void onCheckIn()}
              >
                Registrar check-in
              </button>
            )}
            {verification.estado === 'YA_INGRESADO' && (
              <button
                type="button"
                className="btn btn-secondary"
                disabled={busy}
                onClick={() => void onCheckOut()}
              >
                Registrar check-out
              </button>
            )}
          </div>
        </div>
      )}

      <div className="stack">
        <h2>Disponibilidad física</h2>
        {availability.length === 0 ? (
          <p className="empty-inline">Sin datos de disponibilidad.</p>
        ) : (
          <div className="list-stack">
            {availability.map((item) => (
              <article key={item.parqueaderoId} className="list-row static">
                <div>
                  <strong>{item.nombreParqueadero}</strong>
                  <p className="muted">
                    Ocupados C {item.cuposOcupadosCarros}/{item.capacidadTotalCarros} · M{' '}
                    {item.cuposOcupadosMotos}/{item.capacidadTotalMotos}
                  </p>
                  <p className="muted">
                    Disp. estudiantes C {item.cuposDisponiblesEstudiantesCarros} / M{' '}
                    {item.cuposDisponiblesEstudiantesMotos} · docentes C{' '}
                    {item.cuposDisponiblesDocentesCarros} / M {item.cuposDisponiblesDocentesMotos}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
