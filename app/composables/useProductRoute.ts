export function useProductRoute() {
  const locale = useHomepageLocale()

  function productLink(id: string) {
    return {
      path: `/product/${id}`,
      query: { locale: locale.value },
    }
  }

  function withLocale(path: string) {
    if (!path.startsWith('/')) {
      return path
    }

    if (path.startsWith('/product/')) {
      return productLink(path.replace('/product/', ''))
    }

    return {
      path,
      query: { locale: locale.value },
    }
  }

  return {
    locale: readonly(locale),
    productLink,
    withLocale,
  }
}
