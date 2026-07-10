import { fetchGameDetail, fetchGameList } from '~/lib/api/game'
import { mapGameDetailResponse, mapGameListItemToProduct } from '~/lib/mappers/gameDetail'
import type { Product, ProductDetail } from '~/types'

export function useGameDetail(gameId: MaybeRefOrGetter<string>) {
  const config = useRuntimeConfig()
  const locale = useHomepageLocale()

  const { data, pending, error, refresh } = useAsyncData<ProductDetail | null>(
    () => `game-detail-${toValue(gameId)}-${locale.value}`,
    async () => {
      const id = toValue(gameId)
      if (!id) return null

      const raw = await fetchGameDetail(config.public.apiBaseUrl, id, locale.value)
      return mapGameDetailResponse(raw, locale.value)
    },
    {
      watch: [() => toValue(gameId), locale],
    },
  )

  const { data: recommendedData } = useAsyncData<Product[]>(
    () => `game-recommended-${toValue(gameId)}-${locale.value}`,
    async () => {
      try {
        const id = toValue(gameId)
        const list = await fetchGameList(config.public.apiBaseUrl, locale.value)
        return list.items
          .filter(item => String(item.id) !== id)
          .slice(0, 6)
          .map(mapGameListItemToProduct)
      }
      catch {
        return []
      }
    },
    {
      default: () => [],
      watch: [() => toValue(gameId), locale],
    },
  )

  return {
    product: data,
    recommended: recommendedData,
    pending,
    error,
    refresh,
    locale: readonly(locale),
  }
}
