import type { ApiClient } from '~/lib/api/client'
import type { HomepageResponse } from '~/types/api/homepage'

export function fetchHomepage(client: ApiClient, locale: string): Promise<HomepageResponse> {
  return client.get<HomepageResponse>('/api/v1/client/homepage', { locale })
}
