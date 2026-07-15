import { describe, expect, it } from 'vitest'
import type { User } from '@supabase/supabase-js'
import { resolveAuthAvatarUrl } from '~/lib/auth-avatar'

function mockUser(partial: Partial<User> & { user_metadata?: Record<string, unknown> }): User {
  return {
    id: 'u1',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '',
    ...partial,
  } as User
}

describe('resolveAuthAvatarUrl', () => {
  it('prefers avatar_url over picture', () => {
    const url = resolveAuthAvatarUrl(mockUser({
      user_metadata: {
        avatar_url: 'https://a.example/a.png',
        picture: 'https://b.example/b.png',
      },
    }))
    expect(url).toBe('https://a.example/a.png')
  })

  it('falls back to picture', () => {
    const url = resolveAuthAvatarUrl(mockUser({
      user_metadata: { picture: 'https://lh3.googleusercontent.com/x' },
    }))
    expect(url).toBe('https://lh3.googleusercontent.com/x')
  })

  it('falls back to identity_data', () => {
    const url = resolveAuthAvatarUrl(mockUser({
      user_metadata: {},
      identities: [{
        identity_data: { picture: 'https://id.example/p.png' },
      }] as User['identities'],
    }))
    expect(url).toBe('https://id.example/p.png')
  })

  it('returns undefined when empty', () => {
    expect(resolveAuthAvatarUrl(null)).toBeUndefined()
    expect(resolveAuthAvatarUrl(mockUser({}))).toBeUndefined()
  })
})
