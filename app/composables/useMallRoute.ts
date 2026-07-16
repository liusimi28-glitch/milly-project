import { mallPath, MALL_PREFIX } from '~/lib/mall-routes'

export function useMallRoute() {
  const locale = useHomepageLocale()

  function withLocaleQuery(extraQuery?: Record<string, string>) {
    return {
      locale: locale.value,
      ...extraQuery,
    }
  }

  function mallLink(path = '', extraQuery?: Record<string, string>) {
    return {
      path: mallPath(path),
      query: withLocaleQuery(extraQuery),
    }
  }

  function productLink(id: string) {
    return mallLink(`/product/${id}`)
  }

  function withLocale(path: string, extraQuery?: Record<string, string>) {
    if (!path.startsWith('/')) {
      return path
    }

    if (path.startsWith(MALL_PREFIX)) {
      return {
        path,
        query: withLocaleQuery(extraQuery),
      }
    }

    if (path.startsWith('/product/')) {
      return {
        path: mallPath(path),
        query: withLocaleQuery(extraQuery),
      }
    }

    return mallLink(path.replace(/^\//, ''), extraQuery)
  }

  return {
    locale: readonly(locale),
    mallLink,
    productLink,
    withLocale,
    mallPath,
  }
}
