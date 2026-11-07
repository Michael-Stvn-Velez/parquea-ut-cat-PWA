import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getStoredTokens, setStoredTokens, clearStoredTokens } from '../auth/tokenStorage'
import type { AuthenticationResponse } from '../types/domain'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5258'

export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

let refreshPromise: Promise<AuthenticationResponse | null> | null = null

async function refreshTokens(): Promise<AuthenticationResponse | null> {
  const tokens = getStoredTokens()
  if (!tokens?.refreshToken) {
    return null
  }

  try {
    const { data } = await axios.post<AuthenticationResponse>(
      `${baseURL}/api/auth/refresh`,
      { refreshToken: tokens.refreshToken },
      { headers: { 'Content-Type': 'application/json' } },
    )
    setStoredTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpiresAtUtc: data.accessTokenExpiresAtUtc,
      refreshTokenExpiresAtUtc: data.refreshTokenExpiresAtUtc,
    })
    return data
  } catch {
    clearStoredTokens()
    return null
  }
}

http.interceptors.request.use((config) => {
  const tokens = getStoredTokens()
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined
    if (!original || error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    if (original.url?.includes('/api/auth/login') || original.url?.includes('/api/auth/register')) {
      return Promise.reject(error)
    }

    original._retry = true
    refreshPromise ??= refreshTokens().finally(() => {
      refreshPromise = null
    })

    const refreshed = await refreshPromise
    if (!refreshed) {
      return Promise.reject(error)
    }

    original.headers.Authorization = `Bearer ${refreshed.accessToken}`
    return http(original)
  },
)

export function getApiErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado.'): string {
  if (!axios.isAxiosError(error)) {
    return fallback
  }

  const data = error.response?.data as
    | { title?: string; detail?: string; message?: string }
    | string
    | undefined

  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (data && typeof data === 'object') {
    if (data.title) return data.title
    if (data.detail) return data.detail
    if (data.message) return data.message
  }

  switch (error.response?.status) {
    case 400:
      return 'Los datos enviados no son válidos.'
    case 401:
      return 'No autorizado. Inicia sesión nuevamente.'
    case 403:
      return 'No tienes permiso para esta acción.'
    case 404:
      return 'No se encontró el recurso solicitado.'
    case 409:
      return 'Hay un conflicto con el estado actual del recurso.'
    case 503:
      return 'El servicio no está disponible en este momento.'
    default:
      return fallback
  }
}
