/**
 * TODO: replace with GET /api/v1/client/games/playable when backend provides it.
 */
import { fetchGameList } from '~/lib/api/game'
import { mapGameListItemToProduct } from '~/lib/mappers/gameDetail'
import type { Product } from '~/types'

export interface PlayableGame extends Product {
  playUrl: string
  genreLabel?: string
}

const MOCK_PLAY_URLS = [
  'https://store.steampowered.com/app/427520/',
  'https://factorio.com/demo',
]

export function usePlayableGames() {
  const { publicClient } = useApiClient()
  const locale = useHomepageLocale()
  const { entries } = useLibrary()

  const { data, pending, error, refresh } = useAsyncData<PlayableGame[]>(
    () => `playable-games-${locale.value}`,
    async () => {
      const fromLibrary = (entries.value ?? [])
        .filter(entry => entry.product)
        .map((entry, index) => ({
          ...entry.product!,
          playUrl: entry.product!.supportUrl || MOCK_PLAY_URLS[index % MOCK_PLAY_URLS.length]!,
          genreLabel: entry.product!.tags[0] ?? '影游',
        }))

      if (fromLibrary.length > 0) {
        return fromLibrary
      }

      const result = await fetchGameList(publicClient.value, {
        locale: locale.value,
        page: 1,
        size: 12,
      })

      return result.items.map((item, index) => ({
        ...mapGameListItemToProduct(item),
        playUrl: MOCK_PLAY_URLS[index % MOCK_PLAY_URLS.length]!,
        genreLabel: item.tags?.[0]?.name ?? 'H5',
      }))
    },
    {
      default: () => [],
      watch: [locale, entries],
    },
  )

  return {
    games: data,
    pending,
    error,
    refresh,
  }
}
