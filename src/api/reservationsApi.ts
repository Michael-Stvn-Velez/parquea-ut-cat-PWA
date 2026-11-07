import { http } from './http'
import type {
  CancelReservationResponse,
  CreateReservationRequest,
  Reservation,
} from '../types/domain'

export const reservationsApi = {
  create(payload: CreateReservationRequest) {
    return http.post<Reservation>('/api/reservations', payload).then((r) => r.data)
  },
  myReservations() {
    return http.get<Reservation[]>('/api/reservations/my-reservations').then((r) => r.data)
  },
  getById(id: string) {
    return http.get<Reservation>(`/api/reservations/${id}`).then((r) => r.data)
  },
  cancel(id: string) {
    return http.delete<CancelReservationResponse>(`/api/reservations/${id}`).then((r) => r.data)
  },
}
