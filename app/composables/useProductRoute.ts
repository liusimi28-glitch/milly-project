import { mallPath, MALL_PREFIX } from '~/lib/mall-routes'

export function useProductRoute() {
  const locale = useHomepageLocale()

  function withLocaleQuery(extraQuery?: Record<string, string>) {
    return {
      locale: locale.value,
      ...extraQuery,
    }
  }

  function productLink(id: string) {
    return {
      path: mallPath(`/product/${id}`),
      query: withLocaleQuery(),
    }
  }

  function withLocale(path: string, extraQuery?: Record<string, string>) {
    if (!path.startsWith('/')) {
      return path
    }

    const normalizedPath = path.startsWith(MALL_PREFIX)
      ? path
      : path.startsWith('/product/')
        ? mallPath(path)
        : mallPath(path)

    return {
      path: normalizedPath,
      query: withLocaleQuery(extraQuery),
    }
  }

  function mallLink(path = '', extraQuery?: Record<string, string>) {
    return {
      path: mallPath(path),
      query: withLocaleQuery(extraQuery),
    }
  }

  return {
    locale: readonly(locale),
    productLink,
    withLocale,
    mallLink,
    mallPath,
  }
}
