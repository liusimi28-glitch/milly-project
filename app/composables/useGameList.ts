import { fetchGameList } from '~/lib/api/game'
import { mapGameListItemToProduct } from '~/lib/mappers/gameDetail'
import type { Product } from '~/types'

export interface UseGameListOptions {
  page?: MaybeRefOrGetter<number>
  size?: MaybeRefOrGetter<number>
  query?: MaybeRefOrGetter<string | undefined>
  tag?: MaybeRefOrGetter<string | undefined>
}

export function useGameList(options: UseGameListOptions = {}) {
  const { publicClient } = useApiClient()
  const locale = useHomepageLocale()

  const page = computed(() => toValue(options.page) ?? 1)
  const size = computed(() => toValue(options.size) ?? 20)
  const query = computed(() => toValue(options.query)?.trim() || undefined)
  const tag = computed(() => toValue(options.tag)?.trim() || undefined)

  const { data, pending, error, refresh } = useAsyncData(
    () => `game-list-${locale.value}-${page.value}-${size.value}-${query.value ?? ''}-${tag.value ?? ''}`,
    async () => {
      const result = await fetchGameList(publicClient.value, {
        locale: locale.value,
        page: page.value,
        size: size.value,
        query: query.value,
        tag: tag.value,
      })

      return {
        products: result.items.map(mapGameListItemToProduct),
        total: result.total,
      }
    },
    {
      default: () => ({ products: [] as Product[], total: 0 }),
      watch: [locale, page, size, query, tag],
    },
  )

  return {
    products: computed(() => data.value?.products ?? []),
    total: computed(() => data.value?.total ?? 0),
    pending,
    error,
    refresh,
    locale: readonly(locale),
  }
}
