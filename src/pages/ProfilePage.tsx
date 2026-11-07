import { useAuth } from '../auth/AuthContext'
import { roleLabel } from '../auth/roles'

export function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  const fields = [
    { label: 'Nombre', value: user.fullName },
    { label: 'Correo', value: user.email },
    { label: 'Rol', value: roleLabel(user.role) },
    { label: 'Placa por defecto', value: user.defaultVehiclePlate ?? '—' },
    { label: 'Vehículo por defecto', value: user.defaultVehicleType ?? '—' },
  ]

  return (
    <section className="stack profile-page">
      <header className="page-header">
        <div>
          <h1>Mi perfil</h1>
          <p>Datos de tu cuenta institucional.</p>
        </div>
      </header>

      <dl className="profile-grid">
        {fields.map((field) => (
          <div key={field.label} className="profile-field">
            <dt>{field.label}</dt>
            <dd title={field.value}>{field.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
