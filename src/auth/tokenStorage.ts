const STORAGE_KEY = 'parquea.auth.tokens'

export interface StoredTokens {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAtUtc: string
  refreshTokenExpiresAtUtc: string
}

export function getStoredTokens(): StoredTokens | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredTokens
  } catch {
    return null
  }
}

export function setStoredTokens(tokens: StoredTokens): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
}

export function clearStoredTokens(): void {
  localStorage.removeItem(STORAGE_KEY)
}
