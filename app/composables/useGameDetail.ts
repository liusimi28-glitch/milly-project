import { fetchGameDetail, fetchGameList } from '~/lib/api/game'
import { mapGameDetailResponse, mapGameListItemToProduct } from '~/lib/mappers/gameDetail'
import type { Product, ProductDetail } from '~/types'

export function useGameDetail(gameId: MaybeRefOrGetter<string>) {
  const { publicClient } = useApiClient()
  const locale = useHomepageLocale()

  const { data, pending, error, refresh } = useAsyncData<ProductDetail | null>(
    () => `game-detail-${toValue(gameId)}-${locale.value}`,
    async () => {
      const id = toValue(gameId)
      if (!id) return null

      const raw = await fetchGameDetail(publicClient.value, id, locale.value)
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
        const list = await fetchGameList(publicClient.value, { locale: locale.value, size: 12 })
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
