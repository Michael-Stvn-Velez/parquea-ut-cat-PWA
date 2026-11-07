import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parkingLotsApi } from '../api/parkingLotsApi'
import { reservationsApi } from '../api/reservationsApi'
import { getApiErrorMessage } from '../api/http'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../components/Toast'
import type { ParkingLot, VehicleType } from '../types/domain'

function todayInBogota(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function toApiTime(value: string): string {
  return value.length === 5 ? `${value}:00` : value
}

export function CreateReservationPage() {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [lots, setLots] = useState<ParkingLot[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    parqueaderoId: '',
    tipoVehiculo: (user?.defaultVehicleType ?? 'CARRO') as VehicleType,
    placaVehiculo: user?.defaultVehiclePlate ?? '',
    fecha: todayInBogota(),
    horaInicio: '08:00',
    horaFin: '18:00',
  })

  useEffect(() => {
    void (async () => {
      try {
        const data = await parkingLotsApi.list()
        setLots(data)
        if (data[0]) {
          setForm((prev) => ({ ...prev, parqueaderoId: prev.parqueaderoId || data[0].id }))
        }
      } catch (err) {
        toast.push(getApiErrorMessage(err), 'error')
      }
    })()
  }, [toast])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      const created = await reservationsApi.create({
        parqueaderoId: form.parqueaderoId,
        tipoVehiculo: form.tipoVehiculo,
        placaVehiculo: form.placaVehiculo,
        fecha: form.fecha,
        horaInicio: toApiTime(form.horaInicio),
        horaFin: toApiTime(form.horaFin),
      })
      toast.push(`Reserva creada: ${created.ticketCode}`, 'success')
      navigate(`/reservas/${created.id}`)
    } catch (err) {
      toast.push(getApiErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="stack">
      <header className="page-header">
        <h1>Nueva reserva</h1>
        <p>Horarios interpretados en zona horaria de Colombia.</p>
      </header>

      <form className="form-panel" onSubmit={onSubmit}>
        <label>
          Parqueadero
          <select
            required
            value={form.parqueaderoId}
            onChange={(e) => setForm({ ...form, parqueaderoId: e.target.value })}
          >
            <option value="" disabled>
              Selecciona…
            </option>
            {lots.map((lot) => (
              <option key={lot.id} value={lot.id}>
                {lot.name}
              </option>
            ))}
          </select>
        </label>
        <div className="form-row">
          <label>
            Tipo de vehículo
            <select
              value={form.tipoVehiculo}
              onChange={(e) =>
                setForm({ ...form, tipoVehiculo: e.target.value as VehicleType })
              }
            >
              <option value="CARRO">Carro</option>
              <option value="MOTO">Moto</option>
            </select>
          </label>
          <label>
            Placa
            <input
              required
              maxLength={20}
              value={form.placaVehiculo}
              onChange={(e) => setForm({ ...form, placaVehiculo: e.target.value.toUpperCase() })}
            />
          </label>
        </div>
        <label>
          Fecha
          <input
            type="date"
            required
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          />
        </label>
        <div className="form-row">
          <label>
            Hora inicio
            <input
              type="time"
              required
              value={form.horaInicio}
              onChange={(e) => setForm({ ...form, horaInicio: e.target.value })}
            />
          </label>
          <label>
            Hora fin
            <input
              type="time"
              required
              value={form.horaFin}
              onChange={(e) => setForm({ ...form, horaFin: e.target.value })}
            />
          </label>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading || !form.parqueaderoId}>
          {loading ? 'Reservando…' : 'Confirmar reserva'}
        </button>
      </form>
    </section>
  )
}
