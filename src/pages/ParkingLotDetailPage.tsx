import { type FormEvent, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { parkingLotsApi } from '../api/parkingLotsApi'
import { getApiErrorMessage } from '../api/http'
import { useAuth } from '../auth/AuthContext'
import { canManageParkingLots } from '../auth/roles'
import { useToast } from '../components/Toast'
import type { ParkingLot } from '../types/domain'

export function ParkingLotDetailPage() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const toast = useToast()
  const canManage = !!user && canManageParkingLots(user.role)

  const [lot, setLot] = useState<ParkingLot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    totalCarCapacity: 0,
    totalMotorcycleCapacity: 0,
  })
  const [teacherForm, setTeacherForm] = useState({
    reservedTeacherCarSpaces: 0,
    reservedTeacherMotorcycleSpaces: 0,
  })

  useEffect(() => {
    void (async () => {
      try {
        const data = await parkingLotsApi.getById(id)
        setLot(data)
        setEditForm({
          name: data.name,
          totalCarCapacity: data.totalCarCapacity,
          totalMotorcycleCapacity: data.totalMotorcycleCapacity,
        })
        setTeacherForm({
          reservedTeacherCarSpaces: data.reservedTeacherCarSpaces,
          reservedTeacherMotorcycleSpaces: data.reservedTeacherMotorcycleSpaces,
        })
      } catch (err) {
        setError(getApiErrorMessage(err))
      }
    })()
  }, [id])

  async function onUpdate(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      const updated = await parkingLotsApi.update(id, editForm)
      setLot(updated)
      toast.push('Parqueadero actualizado', 'success')
    } catch (err) {
      toast.push(getApiErrorMessage(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function onTeacherSpots(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      const updated = await parkingLotsApi.setTeacherReservedSpots(id, teacherForm)
      setLot(updated)
      toast.push('Cupos docentes actualizados', 'success')
    } catch (err) {
      toast.push(getApiErrorMessage(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  if (error) {
    return <p className="banner banner-error">{error}</p>
  }

  if (!lot) {
    return <p className="muted">Cargando detalle…</p>
  }

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">
            <Link to="/parqueaderos">Parqueaderos</Link>
          </p>
          <h1>{lot.name}</h1>
          <p>{lot.isActive ? 'Activo' : 'Inactivo'}</p>
        </div>
      </header>

      <dl className="detail-grid">
        <div>
          <dt>Ocupación carros</dt>
          <dd>
            {lot.occupiedCarSpaces} / {lot.totalCarCapacity}
          </dd>
        </div>
        <div>
          <dt>Ocupación motos</dt>
          <dd>
            {lot.occupiedMotorcycleSpaces} / {lot.totalMotorcycleCapacity}
          </dd>
        </div>
        <div>
          <dt>Cupos docentes carros</dt>
          <dd>{lot.reservedTeacherCarSpaces}</dd>
        </div>
        <div>
          <dt>Cupos docentes motos</dt>
          <dd>{lot.reservedTeacherMotorcycleSpaces}</dd>
        </div>
      </dl>

      {canManage && (
        <>
          <form className="form-panel" onSubmit={onUpdate}>
            <h2>Editar parqueadero</h2>
            <label>
              Nombre
              <input
                required
                maxLength={160}
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </label>
            <div className="form-row">
              <label>
                Capacidad carros
                <input
                  type="number"
                  min={0}
                  value={editForm.totalCarCapacity}
                  onChange={(e) =>
                    setEditForm({ ...editForm, totalCarCapacity: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Capacidad motos
                <input
                  type="number"
                  min={0}
                  value={editForm.totalMotorcycleCapacity}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      totalMotorcycleCapacity: Number(e.target.value),
                    })
                  }
                />
              </label>
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              Guardar cambios
            </button>
          </form>

          <form className="form-panel" onSubmit={onTeacherSpots}>
            <h2>Cupos reservados docentes</h2>
            <div className="form-row">
              <label>
                Carros
                <input
                  type="number"
                  min={0}
                  value={teacherForm.reservedTeacherCarSpaces}
                  onChange={(e) =>
                    setTeacherForm({
                      ...teacherForm,
                      reservedTeacherCarSpaces: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Motos
                <input
                  type="number"
                  min={0}
                  value={teacherForm.reservedTeacherMotorcycleSpaces}
                  onChange={(e) =>
                    setTeacherForm({
                      ...teacherForm,
                      reservedTeacherMotorcycleSpaces: Number(e.target.value),
                    })
                  }
                />
              </label>
            </div>
            <button className="btn btn-secondary" type="submit" disabled={saving}>
              Actualizar cupos
            </button>
          </form>
        </>
      )}
    </section>
  )
}
