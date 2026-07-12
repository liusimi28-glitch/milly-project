export function useProductRoute() {
  const locale = useHomepageLocale()

  function productLink(id: string) {
    return {
      path: `/product/${id}`,
      query: { locale: locale.value },
    }
  }

  function withLocale(path: string, extraQuery?: Record<string, string>) {
    if (!path.startsWith('/')) {
      return path
    }

    const query: Record<string, string> = {
      locale: locale.value,
      ...extraQuery,
    }

    if (path.startsWith('/product/')) {
      return {
        path,
        query,
      }
    }

    return {
      path,
      query,
    }
  }

  return {
    locale: readonly(locale),
    productLink,
    withLocale,
  }
}
