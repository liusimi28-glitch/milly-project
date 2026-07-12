import type { ApiClient } from '~/lib/api/client'
import type { ListResult } from '~/types/api/common'
import type { Promotion } from '~/types/api/promotion'

export function fetchPromotions(
  client: ApiClient,
  params?: { page?: number, size?: number },
): Promise<ListResult<Promotion>> {
  return client.get<ListResult<Promotion>>('/api/v1/client/promotion', params)
}
