import type { ApiClient } from '~/lib/api/client'
import type { ListResult } from '~/types/api/common'
import type { PlayerLibraryItem, UpdatePlayTimeRequest } from '~/types/api/library'

export function fetchLibrary(
  client: ApiClient,
  params?: { page?: number, size?: number },
): Promise<ListResult<PlayerLibraryItem>> {
  return client.get<ListResult<PlayerLibraryItem>>('/api/v1/client/library', params)
}

export function updatePlaytime(
  client: ApiClient,
  gameId: number,
  body: UpdatePlayTimeRequest,
): Promise<void> {
  return client.put<void>(`/api/v1/client/library/${gameId}/playtime`, body)
}
