import type { UserRole } from '../types/domain'

export function homePathForRole(role: UserRole): string {
  switch (role) {
    case 'ESTUDIANTE':
    case 'PROFESOR':
      return '/reservas'
    case 'GUARDA':
      return '/porteria'
    case 'ADMIN':
      return '/admin'
  }
}

export function canManageParkingLots(role: UserRole): boolean {
  return role === 'GUARDA' || role === 'ADMIN'
}

export function canOperateAccessControl(role: UserRole): boolean {
  return role === 'GUARDA' || role === 'ADMIN'
}

export function canCreateReservations(role: UserRole): boolean {
  return role === 'ESTUDIANTE' || role === 'PROFESOR'
}

export function canViewAdminStats(role: UserRole): boolean {
  return role === 'ADMIN'
}

export function roleLabel(role: UserRole): string {
  switch (role) {
    case 'ESTUDIANTE':
      return 'Estudiante'
    case 'PROFESOR':
      return 'Profesor'
    case 'GUARDA':
      return 'Guarda'
    case 'ADMIN':
      return 'Administrador'
  }
}
