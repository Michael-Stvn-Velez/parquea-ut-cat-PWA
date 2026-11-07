import { http } from './http'
import type {
  AuthenticationResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
} from '../types/domain'

export const authApi = {
  register(payload: RegisterRequest) {
    return http.post<AuthenticationResponse>('/api/auth/register', payload).then((r) => r.data)
  },
  login(payload: LoginRequest) {
    return http.post<AuthenticationResponse>('/api/auth/login', payload).then((r) => r.data)
  },
  me() {
    return http.get<UserProfile>('/api/auth/me').then((r) => r.data)
  },
  refresh(refreshToken: string) {
    return http
      .post<AuthenticationResponse>('/api/auth/refresh', { refreshToken })
      .then((r) => r.data)
  },
}
