import { http } from './http'
import type { OccupancyStats } from '../types/domain'

export interface OccupancyStatsQuery {
  fechaInicio?: string
  fechaFin?: string
  parqueaderoId?: string
}

export const adminApi = {
  occupancyStats(query: OccupancyStatsQuery = {}) {
    return http
      .get<OccupancyStats>('/api/admin/occupancy-stats', {
        params: {
          fechaInicio: query.fechaInicio || undefined,
          fechaFin: query.fechaFin || undefined,
          parqueaderoId: query.parqueaderoId || undefined,
        },
      })
      .then((r) => r.data)
  },
}
