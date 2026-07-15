/**
 * Auth redirect helpers: prevent open redirects and parse OAuth error params.
 */

export function sanitizeAuthRedirectPath(path: string | null | undefined): string {
  if (!path) return '/'

  const trimmed = path.trim()
  if (!trimmed.startsWith('/')) return '/'
  if (trimmed.startsWith('//')) return '/'
  if (trimmed.includes('://')) return '/'

  return trimmed
}

export function buildAuthCallbackUrl(origin: string, redirectPath?: string | null): string {
  const safe = sanitizeAuthRedirectPath(redirectPath)
  const url = new URL('/auth/callback', origin)
  if (safe !== '/') {
    url.searchParams.set('redirect', safe)
  }
  return url.toString()
}

export interface OAuthCallbackError {
  error: string
  errorDescription?: string
}

/** Parse OAuth error from query string and/or URL hash fragment. */
export function parseOAuthCallbackError(
  query: Record<string, unknown>,
  hash = '',
): OAuthCallbackError | null {
  const fromQuery = readErrorFields(query)
  if (fromQuery) return fromQuery

  if (!hash) return null
  const fragment = hash.startsWith('#') ? hash.slice(1) : hash
  const params = new URLSearchParams(fragment)
  return readErrorFields(Object.fromEntries(params.entries()))
}

function readErrorFields(source: Record<string, unknown>): OAuthCallbackError | null {
  const error = typeof source.error === 'string' ? source.error : undefined
  if (!error) return null

  const rawDescription = source.error_description ?? source.errorDescription
  const errorDescription = typeof rawDescription === 'string'
    ? decodeURIComponent(rawDescription.replace(/\+/g, ' '))
    : undefined

  return { error, errorDescription }
}

export function formatOAuthErrorMessage(oauthError: OAuthCallbackError): string {
  if (oauthError.error === 'access_denied') {
    return '已取消 Google 登录，请重试。'
  }
  if (oauthError.errorDescription) {
    return oauthError.errorDescription
  }
  return `登录失败（${oauthError.error}），请重试。`
}
