import { apiGet } from '~/lib/api/client'
import type { HomepageResponse } from '~/types/api/homepage'

export function fetchHomepage(baseUrl: string, locale: string): Promise<HomepageResponse> {
  return apiGet<HomepageResponse>(baseUrl, '/api/v1/client/homepage', { locale })
}
