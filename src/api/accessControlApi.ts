import { http } from './http'
import type {
  AccessOperationResponse,
  ParkingAvailability,
  TicketVerification,
} from '../types/domain'

export const accessControlApi = {
  availability(parqueaderoId?: string) {
    return http
      .get<ParkingAvailability[]>('/api/access-control/parking-availability', {
        params: parqueaderoId ? { parqueaderoId } : undefined,
      })
      .then((r) => r.data)
  },
  verify(codigoTicket: string) {
    return http
      .get<TicketVerification>(`/api/access-control/verify/${encodeURIComponent(codigoTicket)}`)
      .then((r) => r.data)
  },
  checkIn(codigoTicket: string, observaciones?: string | null) {
    return http
      .post<AccessOperationResponse>('/api/access-control/check-in', {
        codigoTicket,
        observaciones: observaciones ?? null,
      })
      .then((r) => r.data)
  },
  checkOut(codigoTicket: string) {
    return http
      .post<AccessOperationResponse>('/api/access-control/check-out', { codigoTicket })
      .then((r) => r.data)
  },
}
