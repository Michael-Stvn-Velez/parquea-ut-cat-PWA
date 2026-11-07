import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../components/Toast'

export function LoginPage() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      await login({ email, password })
      toast.push('Sesión iniciada', 'success')
      navigate('/')
    } catch (error) {
      toast.push(error instanceof Error ? error.message : 'Error al iniciar sesión', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-hero">
        <p className="eyebrow">UT CAT Medellín</p>
        <h1>Parquea UT CAT</h1>
        <p className="lede">
          Reserva tu cupo, presenta tu ticket en portería y gestiona la operación del campus.
        </p>
      </section>

      <form className="auth-panel" onSubmit={onSubmit}>
        <h2>Iniciar sesión</h2>
        <label>
          Correo institucional
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nombre@ut.edu.co"
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
        <p className="muted">
          ¿Aún no tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </form>
    </div>
  )
}
