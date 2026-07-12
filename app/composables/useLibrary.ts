import { fetchGameDetail } from '~/lib/api/game'
import { fetchLibrary } from '~/lib/api/library'
import { mapGameDetailResponse } from '~/lib/mappers/gameDetail'
import type { ProductDetail } from '~/types'
import type { PlayerLibraryItem } from '~/types/api/library'

export interface LibraryGameEntry {
  library: PlayerLibraryItem
  product: ProductDetail | null
}

export function useLibrary() {
  const { authClient, publicClient } = useApiClient()
  const { isLoggedIn } = useApiAuth()
  const locale = useHomepageLocale()

  const { data, pending, error, refresh } = useAsyncData<LibraryGameEntry[]>(
    () => `user-library-${locale.value}`,
    async () => {
      if (!isLoggedIn.value) return []

      const result = await fetchLibrary(authClient.value, { page: 1, size: 100 })
      const entries = await Promise.all(
        result.items.map(async (libraryItem) => {
          try {
            const raw = await fetchGameDetail(publicClient.value, String(libraryItem.game_id), locale.value)
            return {
              library: libraryItem,
              product: mapGameDetailResponse(raw, locale.value),
            }
          }
          catch {
            return {
              library: libraryItem,
              product: null,
            }
          }
        }),
      )

      return entries
    },
    {
      default: () => [],
      watch: [isLoggedIn, locale],
    },
  )

  return {
    entries: data,
    pending,
    error,
    refresh,
    locale: readonly(locale),
  }
}
