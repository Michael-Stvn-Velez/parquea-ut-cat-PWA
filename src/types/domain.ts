export type UserRole = 'ESTUDIANTE' | 'PROFESOR' | 'GUARDA' | 'ADMIN'

export type VehicleType = 'CARRO' | 'MOTO'

export type ReservationStatus =
  | 'CONFIRMADA'
  | 'INGRESADO'
  | 'FINALIZADA'
  | 'CANCELADA'
  | 'EXPIRADA'

export type TicketVerificationStatus =
  | 'VALIDO'
  | 'YA_INGRESADO'
  | 'EXPIRADO'
  | 'INVALIDO'

export interface UserProfile {
  id: string
  fullName: string
  email: string
  role: UserRole
  defaultVehiclePlate: string | null
  defaultVehicleType: VehicleType | null
}

export interface AuthenticationResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAtUtc: string
  refreshTokenExpiresAtUtc: string
  user: UserProfile
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: 'ESTUDIANTE' | 'PROFESOR'
  defaultVehiclePlate?: string | null
  defaultVehicleType?: VehicleType | null
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ParkingLot {
  id: string
  name: string
  totalCarCapacity: number
  totalMotorcycleCapacity: number
  reservedTeacherCarSpaces: number
  reservedTeacherMotorcycleSpaces: number
  occupiedCarSpaces: number
  occupiedMotorcycleSpaces: number
  isActive: boolean
}

export interface CreateParkingLotRequest {
  name: string
  totalCarCapacity: number
  totalMotorcycleCapacity: number
}

export interface UpdateParkingLotRequest {
  name: string
  totalCarCapacity: number
  totalMotorcycleCapacity: number
}

export interface SetTeacherReservedSpotsRequest {
  reservedTeacherCarSpaces: number
  reservedTeacherMotorcycleSpaces: number
}

export interface Reservation {
  id: string
  ticketCode: string
  parqueaderoId: string
  nombreParqueadero: string
  tipoVehiculo: VehicleType
  placaVehiculo: string
  fecha: string
  horaInicio: string
  horaFin: string
  esReservaPrioritariaDocente: boolean
  estado: ReservationStatus
}

export interface CreateReservationRequest {
  parqueaderoId: string
  tipoVehiculo: VehicleType
  placaVehiculo: string
  fecha: string
  horaInicio: string
  horaFin: string
}

export interface CancelReservationResponse {
  message: string
}

export interface ParkingAvailability {
  parqueaderoId: string
  nombreParqueadero: string
  capacidadTotalCarros: number
  capacidadTotalMotos: number
  cuposOcupadosCarros: number
  cuposOcupadosMotos: number
  cuposReservadosDocentesCarros: number
  cuposReservadosDocentesMotos: number
  cuposReservadosDocentesDisponiblesCarros: number
  cuposReservadosDocentesDisponiblesMotos: number
  cuposDisponiblesEstudiantesCarros: number
  cuposDisponiblesEstudiantesMotos: number
  cuposDisponiblesDocentesCarros: number
  cuposDisponiblesDocentesMotos: number
}

export interface TicketVerification {
  estado: TicketVerificationStatus
  mensaje: string
  reservaId: string | null
  codigoTicket: string | null
  placaVehiculo: string | null
  tipoVehiculo: VehicleType | null
  parqueaderoId: string | null
  nombreParqueadero: string | null
  nombreUsuario: string | null
  rolUsuario: UserRole | null
  fecha: string | null
  horaInicio: string | null
  horaFin: string | null
}

export interface AccessOperationResponse {
  mensaje: string
  reservaId: string
  codigoTicket: string
  parqueaderoId: string
  nombreParqueadero: string
  placaVehiculo: string
  tipoVehiculo: VehicleType
  estado: ReservationStatus
}

export interface OccupancyMetric {
  ocupados: number
  capacidad: number
  porcentajeOcupacion: number
}

export interface RoleUsage {
  rol: UserRole
  reservas: number
  usosEfectivos: number
}

export interface RoleCount {
  rol: UserRole
  cantidad: number
}

export interface HourlyUsage {
  hora: number
  ingresos: number
  reservas: number
}

export interface OccupancyStats {
  fechaInicio: string
  fechaFin: string
  parqueaderosIncluidos: number
  carros: OccupancyMetric
  motos: OccupancyMetric
  total: OccupancyMetric
  distribucionPorRol: RoleUsage[]
  totalIngresos: number
  totalSalidas: number
  reservasCanceladas: number
  reservasExpiradas: number
  reservasCanceladasPorRol: RoleCount[]
  reservasExpiradasPorRol: RoleCount[]
  volumenPorHora: HourlyUsage[]
  horasPico: HourlyUsage[]
}

export interface HealthResponse {
  isConnected: boolean
  checkedAtUtc: string
}
