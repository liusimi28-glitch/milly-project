import { describe, expect, it } from 'vitest'
import {
  buildAuthCallbackUrl,
  formatOAuthErrorMessage,
  parseOAuthCallbackError,
  sanitizeAuthRedirectPath,
} from '~/lib/auth-redirect'

describe('sanitizeAuthRedirectPath', () => {
  it('keeps safe in-app paths', () => {
    expect(sanitizeAuthRedirectPath('/product/103?locale=zh-CN')).toBe('/product/103?locale=zh-CN')
  })

  it('rejects open redirects', () => {
    expect(sanitizeAuthRedirectPath('https://evil.com')).toBe('/')
    expect(sanitizeAuthRedirectPath('//evil.com')).toBe('/')
    expect(sanitizeAuthRedirectPath('evil.com')).toBe('/')
  })

  it('defaults empty to home', () => {
    expect(sanitizeAuthRedirectPath('')).toBe('/')
    expect(sanitizeAuthRedirectPath(null)).toBe('/')
  })
})

describe('buildAuthCallbackUrl', () => {
  it('embeds sanitized redirect query', () => {
    const url = buildAuthCallbackUrl('https://shop.example', '/product/103?locale=zh-CN')
    expect(url).toContain('/auth/callback')
    expect(url).toContain('redirect=%2Fproduct%2F103%3Flocale%3Dzh-CN')
  })

  it('omits redirect query when path is home', () => {
    const url = buildAuthCallbackUrl('https://shop.example', '//evil.com')
    expect(url).toBe('https://shop.example/auth/callback')
  })
})

describe('parseOAuthCallbackError', () => {
  it('reads query errors', () => {
    expect(parseOAuthCallbackError({ error: 'access_denied' })).toEqual({
      error: 'access_denied',
      errorDescription: undefined,
    })
  })

  it('reads hash fragment errors', () => {
    const result = parseOAuthCallbackError(
      {},
      '#error=server_error&error_description=Something+went+wrong',
    )
    expect(result?.error).toBe('server_error')
    expect(result?.errorDescription).toBe('Something went wrong')
  })
})

describe('formatOAuthErrorMessage', () => {
  it('maps access_denied to Chinese cancel message', () => {
    expect(formatOAuthErrorMessage({ error: 'access_denied' })).toContain('取消')
  })
})
