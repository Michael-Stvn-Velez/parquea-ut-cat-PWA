import { http } from './http'
import type { HealthResponse } from '../types/domain'

export const healthApi = {
  check() {
    return http.get<HealthResponse>('/api/health').then((r) => r.data)
  },
}
