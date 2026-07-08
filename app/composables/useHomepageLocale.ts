const DEFAULT_LOCALE = 'en'

export function useHomepageLocale() {
  const route = useRoute()

  return useState<string>('homepage-locale', () => {
    const queryLocale = typeof route.query.locale === 'string' ? route.query.locale.trim() : ''
    if (queryLocale) {
      return normalizeLocale(queryLocale)
    }

    if (import.meta.server) {
      const headers = useRequestHeaders(['accept-language'])
      const acceptLanguage = headers['accept-language']
      if (acceptLanguage) {
        const primary = acceptLanguage.split(',')[0]?.split(';')[0]?.trim()
        if (primary) {
          return normalizeLocale(primary)
        }
      }
    }

    return DEFAULT_LOCALE
  })
}

function normalizeLocale(locale: string): string {
  const trimmed = locale.trim().toLowerCase()
  if (!trimmed) return DEFAULT_LOCALE
  if (trimmed.startsWith('zh')) return 'zh-CN'
  if (trimmed.startsWith('en')) return 'en'
  return trimmed.split('-')[0] || DEFAULT_LOCALE
}
