import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parkingLotsApi } from '../api/parkingLotsApi'
import { getApiErrorMessage } from '../api/http'
import { useToast } from '../components/Toast'

export function CreateParkingLotPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    totalCarCapacity: 20,
    totalMotorcycleCapacity: 10,
  })

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      const created = await parkingLotsApi.create(form)
      toast.push('Parqueadero creado', 'success')
      navigate(`/parqueaderos/${created.id}`)
    } catch (err) {
      toast.push(getApiErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="stack">
      <header className="page-header">
        <h1>Crear parqueadero</h1>
        <p>Define nombre y capacidades iniciales.</p>
      </header>

      <form className="form-panel" onSubmit={onSubmit}>
        <label>
          Nombre
          <input
            required
            maxLength={160}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <div className="form-row">
          <label>
            Capacidad carros
            <input
              type="number"
              min={0}
              value={form.totalCarCapacity}
              onChange={(e) => setForm({ ...form, totalCarCapacity: Number(e.target.value) })}
            />
          </label>
          <label>
            Capacidad motos
            <input
              type="number"
              min={0}
              value={form.totalMotorcycleCapacity}
              onChange={(e) =>
                setForm({ ...form, totalMotorcycleCapacity: Number(e.target.value) })
              }
            />
          </label>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creando…' : 'Crear'}
        </button>
      </form>
    </section>
  )
}
