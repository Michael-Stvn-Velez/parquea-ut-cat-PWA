import { http } from './http'
import type {
  CreateParkingLotRequest,
  ParkingLot,
  SetTeacherReservedSpotsRequest,
  UpdateParkingLotRequest,
} from '../types/domain'

export const parkingLotsApi = {
  list() {
    return http.get<ParkingLot[]>('/api/parking-lots').then((r) => r.data)
  },
  getById(id: string) {
    return http.get<ParkingLot>(`/api/parking-lots/${id}`).then((r) => r.data)
  },
  create(payload: CreateParkingLotRequest) {
    return http.post<ParkingLot>('/api/parking-lots', payload).then((r) => r.data)
  },
  update(id: string, payload: UpdateParkingLotRequest) {
    return http.put<ParkingLot>(`/api/parking-lots/${id}`, payload).then((r) => r.data)
  },
  setTeacherReservedSpots(id: string, payload: SetTeacherReservedSpotsRequest) {
    return http
      .patch<ParkingLot>(`/api/parking-lots/${id}/reserved-spots-teacher`, payload)
      .then((r) => r.data)
  },
}
