import type { User } from '@supabase/supabase-js'

/**
 * Resolve avatar URL from a Supabase Auth user.
 * Priority: user_metadata.avatar_url → picture → first identity_data avatar_url|picture.
 */
export function resolveAuthAvatarUrl(user: User | null | undefined): string | undefined {
  if (!user) return undefined

  const meta = user.user_metadata as Record<string, unknown> | undefined
  const fromMeta = firstNonEmptyURL(meta?.avatar_url, meta?.picture)
  if (fromMeta) return fromMeta

  const identities = user.identities
  if (!Array.isArray(identities)) return undefined

  for (const identity of identities) {
    const data = identity.identity_data as Record<string, unknown> | undefined
    const fromIdentity = firstNonEmptyURL(data?.avatar_url, data?.picture)
    if (fromIdentity) return fromIdentity
  }

  return undefined
}

function firstNonEmptyURL(...candidates: unknown[]): string | undefined {
  for (const c of candidates) {
    if (typeof c === 'string') {
      const trimmed = c.trim()
      if (trimmed) return trimmed
    }
  }
  return undefined
}
