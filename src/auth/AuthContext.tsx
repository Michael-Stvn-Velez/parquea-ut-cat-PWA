import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authApi } from '../api/authApi'
import { getApiErrorMessage } from '../api/http'
import type {
  AuthenticationResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
} from '../types/domain'
import { clearStoredTokens, getStoredTokens, setStoredTokens } from './tokenStorage'

interface AuthContextValue {
  user: UserProfile | null
  bootstrapping: boolean
  login: (payload: LoginRequest) => Promise<void>
  register: (payload: RegisterRequest) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function persistSession(data: AuthenticationResponse) {
  setStoredTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    accessTokenExpiresAtUtc: data.accessTokenExpiresAtUtc,
    refreshTokenExpiresAtUtc: data.refreshTokenExpiresAtUtc,
  })
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [bootstrapping, setBootstrapping] = useState(true)

  const logout = useCallback(() => {
    clearStoredTokens()
    setUser(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    const profile = await authApi.me()
    setUser(profile)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const tokens = getStoredTokens()
      if (!tokens) {
        if (!cancelled) setBootstrapping(false)
        return
      }

      try {
        const profile = await authApi.me()
        if (!cancelled) setUser(profile)
      } catch {
        try {
          const refreshed = await authApi.refresh(tokens.refreshToken)
          persistSession(refreshed)
          if (!cancelled) setUser(refreshed.user)
        } catch {
          clearStoredTokens()
          if (!cancelled) setUser(null)
        }
      } finally {
        if (!cancelled) setBootstrapping(false)
      }
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (payload: LoginRequest) => {
    try {
      const data = await authApi.login(payload)
      persistSession(data)
      setUser(data.user)
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'No fue posible iniciar sesión.'))
    }
  }, [])

  const register = useCallback(async (payload: RegisterRequest) => {
    try {
      const data = await authApi.register(payload)
      persistSession(data)
      setUser(data.user)
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'No fue posible registrar la cuenta.'))
    }
  }, [])

  const value = useMemo(
    () => ({ user, bootstrapping, login, register, logout, refreshProfile }),
    [user, bootstrapping, login, register, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return ctx
}
