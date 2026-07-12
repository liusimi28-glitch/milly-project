import type { ApiClient } from '~/lib/api/client'
import type { ListResult } from '~/types/api/common'
import type { GameDetail, GameListItem } from '~/types/api/game'

export interface FetchGameListParams {
  locale: string
  page?: number
  size?: number
  query?: string
  tag?: string
}

export function fetchGameDetail(
  client: ApiClient,
  id: string,
  locale: string,
): Promise<GameDetail> {
  return client.get<GameDetail>(`/api/v1/client/game/${encodeURIComponent(id)}`, { locale })
}

export function fetchGameList(
  client: ApiClient,
  params: FetchGameListParams,
): Promise<ListResult<GameListItem>> {
  return client.get<ListResult<GameListItem>>('/api/v1/client/game', {
    locale: params.locale,
    page: params.page,
    size: params.size,
    query: params.query,
    tag: params.tag,
  })
}
