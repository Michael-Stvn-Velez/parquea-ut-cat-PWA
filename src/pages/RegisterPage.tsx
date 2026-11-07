import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../components/Toast'
import type { VehicleType } from '../types/domain'

export function RegisterPage() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ESTUDIANTE' as 'ESTUDIANTE' | 'PROFESOR',
    defaultVehiclePlate: '',
    defaultVehicleType: '' as '' | VehicleType,
  })

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!form.email.toLowerCase().endsWith('@ut.edu.co')) {
      toast.push('El correo debe ser del dominio @ut.edu.co', 'error')
      return
    }
    setLoading(true)
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        defaultVehiclePlate: form.defaultVehiclePlate || null,
        defaultVehicleType: form.defaultVehicleType || null,
      })
      toast.push('Cuenta creada correctamente', 'success')
      navigate('/')
    } catch (error) {
      toast.push(error instanceof Error ? error.message : 'Error al registrar', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-hero">
        <p className="eyebrow">Registro institucional</p>
        <h1>Crea tu cuenta</h1>
        <p className="lede">Solo estudiantes y profesores pueden registrarse desde la app.</p>
      </section>

      <form className="auth-panel" onSubmit={onSubmit}>
        <h2>Registro</h2>
        <label>
          Nombre completo
          <input
            required
            maxLength={120}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label>
          Correo @ut.edu.co
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          Contraseña (mín. 8)
          <input
            type="password"
            required
            minLength={8}
            maxLength={128}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <label>
          Rol
          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as 'ESTUDIANTE' | 'PROFESOR' })
            }
          >
            <option value="ESTUDIANTE">Estudiante</option>
            <option value="PROFESOR">Profesor</option>
          </select>
        </label>
        <label>
          Placa por defecto (opcional)
          <input
            maxLength={20}
            value={form.defaultVehiclePlate}
            onChange={(e) => setForm({ ...form, defaultVehiclePlate: e.target.value })}
          />
        </label>
        <label>
          Tipo de vehículo por defecto
          <select
            value={form.defaultVehicleType}
            onChange={(e) =>
              setForm({ ...form, defaultVehicleType: e.target.value as '' | VehicleType })
            }
          >
            <option value="">Sin definir</option>
            <option value="CARRO">Carro</option>
            <option value="MOTO">Moto</option>
          </select>
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creando…' : 'Crear cuenta'}
        </button>
        <p className="muted">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  )
}
