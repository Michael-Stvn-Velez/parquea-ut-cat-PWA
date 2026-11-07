import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { reservationsApi } from '../api/reservationsApi'
import { getApiErrorMessage } from '../api/http'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../components/Toast'
import type { Reservation } from '../types/domain'

export function ReservationDetailPage() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void (async () => {
      try {
        setReservation(await reservationsApi.getById(id))
      } catch (err) {
        setError(getApiErrorMessage(err))
      }
    })()
  }, [id])

  async function copyTicket() {
    if (!reservation) return
    try {
      await navigator.clipboard.writeText(reservation.ticketCode)
      toast.push('Código copiado', 'success')
    } catch {
      toast.push('No se pudo copiar el código', 'error')
    }
  }

  async function cancel() {
    if (!reservation) return
    if (!window.confirm('¿Cancelar esta reserva?')) return
    setBusy(true)
    try {
      const result = await reservationsApi.cancel(reservation.id)
      toast.push(result.message, 'success')
      navigate('/reservas')
    } catch (err) {
      toast.push(getApiErrorMessage(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  if (error) return <p className="banner banner-error">{error}</p>
  if (!reservation) return <p className="muted">Cargando reserva…</p>

  const canCancel =
    reservation.estado === 'CONFIRMADA' &&
    (user?.role === 'ADMIN' || user?.role === 'ESTUDIANTE' || user?.role === 'PROFESOR')

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">
            <Link to={user?.role === 'ADMIN' ? '/parqueaderos' : '/reservas'}>Volver</Link>
          </p>
          <h1>Ticket digital</h1>
          <p>{reservation.nombreParqueadero}</p>
        </div>
        <span className={`badge badge-${reservation.estado.toLowerCase()}`}>
          {reservation.estado}
        </span>
      </header>

      <div className="ticket-panel">
        <p className="ticket-code">{reservation.ticketCode}</p>
        <div className="qr-wrap">
          <QRCodeSVG value={reservation.ticketCode} size={180} bgColor="#F3F6F2" fgColor="#0F3D2E" />
        </div>
        <div className="actions-row">
          <button type="button" className="btn btn-secondary" onClick={() => void copyTicket()}>
            Copiar código
          </button>
          {canCancel && (
            <button
              type="button"
              className="btn btn-danger"
              disabled={busy}
              onClick={() => void cancel()}
            >
              Cancelar reserva
            </button>
          )}
        </div>
      </div>

      <dl className="detail-grid">
        <div>
          <dt>Placa</dt>
          <dd>{reservation.placaVehiculo}</dd>
        </div>
        <div>
          <dt>Vehículo</dt>
          <dd>{reservation.tipoVehiculo}</dd>
        </div>
        <div>
          <dt>Fecha</dt>
          <dd>{reservation.fecha}</dd>
        </div>
        <div>
          <dt>Horario</dt>
          <dd>
            {reservation.horaInicio.slice(0, 5)} – {reservation.horaFin.slice(0, 5)}
          </dd>
        </div>
        <div>
          <dt>Prioridad docente</dt>
          <dd>{reservation.esReservaPrioritariaDocente ? 'Sí' : 'No'}</dd>
        </div>
      </dl>
    </section>
  )
}
