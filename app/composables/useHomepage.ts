import { fetchHomepage } from '~/lib/api/homepage'
import { emptyHomepageViewModel, mapHomepageResponse } from '~/lib/mappers/homepage'
import type { HomepageViewModel } from '~/lib/mappers/homepage'

export function useHomepage() {
  const config = useRuntimeConfig()
  const locale = useHomepageLocale()

  const { data, pending, error, refresh } = useAsyncData<HomepageViewModel>(
    () => `homepage-${locale.value}`,
    async () => {
      const raw = await fetchHomepage(config.public.apiBaseUrl, locale.value)
      return mapHomepageResponse(raw)
    },
    {
      default: () => emptyHomepageViewModel(),
      watch: [locale],
    },
  )

  const viewModel = computed(() => data.value ?? emptyHomepageViewModel())

  return {
    banners: computed(() => viewModel.value.banners),
    categoryQuickLinks: computed(() => viewModel.value.categoryQuickLinks),
    weeklyTrends: computed(() => viewModel.value.weeklyTrends),
    bestsellers: computed(() => viewModel.value.bestsellers),
    genres: computed(() => viewModel.value.genres),
    budgetUnder5: computed(() => viewModel.value.budgetUnder5),
    budgetUnder10: computed(() => viewModel.value.budgetUnder10),
    randomKeys: computed(() => viewModel.value.randomKeys),
    meta: computed(() => viewModel.value.meta),
    pending,
    error,
    refresh,
    locale: readonly(locale),
  }
}
