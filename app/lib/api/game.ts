import { apiGet } from '~/lib/api/client'
import type { GameDetailResponse, GameListResponse } from '~/types/api/game'

export function fetchGameDetail(
  baseUrl: string,
  id: string,
  locale: string,
): Promise<GameDetailResponse> {
  return apiGet<GameDetailResponse>(baseUrl, `/api/v1/client/game/${encodeURIComponent(id)}`, { locale })
}

export function fetchGameList(
  baseUrl: string,
  locale: string,
): Promise<GameListResponse> {
  return apiGet<GameListResponse>(baseUrl, '/api/v1/client/game', { locale })
}
