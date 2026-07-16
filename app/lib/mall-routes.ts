export const MALL_PREFIX = '/mall'

export function mallPath(path = ''): string {
  if (!path || path === '/') {
    return MALL_PREFIX
  }

  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${MALL_PREFIX}${normalized}`
}

export function mallPathWithLocale(path: string, locale: string): string {
  const params = new URLSearchParams({ locale })
  return `${mallPath(path)}?${params.toString()}`
}
