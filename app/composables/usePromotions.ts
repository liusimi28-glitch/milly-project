import { fetchPromotions } from '~/lib/api/promotion'
import type { Promotion } from '~/types/api/promotion'

export function usePromotions() {
  const { publicClient } = useApiClient()

  const { data, pending, error, refresh } = useAsyncData<Promotion[]>(
    'promotions',
    async () => {
      const result = await fetchPromotions(publicClient.value, { page: 1, size: 20 })
      return result.items
    },
    {
      default: () => [],
    },
  )

  return {
    promotions: data,
    pending,
    error,
    refresh,
  }
}
