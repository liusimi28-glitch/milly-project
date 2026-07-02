import { banners } from '~/data/mock/banners'
import { categories, categoryQuickLinks } from '~/data/mock/categories'
import { footerColumns, paymentMethods } from '~/data/mock/footer'
import { searchSuggestions, headerNavLinks, topBarLinks } from '~/data/mock/navigation'
import { products } from '~/data/mock/products'
import type { Product } from '~/types'

export function useMockProducts() {
  const getByTag = (tag: string, limit?: number): Product[] => {
    const filtered = products.filter(p => p.tags.includes(tag))
    return limit ? filtered.slice(0, limit) : filtered
  }

  return {
    products,
    banners,
    categories,
    categoryQuickLinks,
    topBarLinks,
    headerNavLinks,
    searchSuggestions,
    footerColumns,
    paymentMethods,
    weeklyTrends: getByTag('weekly-trend', 12),
    bestsellers: getByTag('bestseller', 8),
    budgetUnder5: getByTag('under-5', 8),
    budgetUnder10: getByTag('under-10', 8),
    randomKeys: getByTag('random-keys', 4),
    plusDeals: getByTag('plus', 6),
    getByTag,
    getByGenre: (genre: string, limit = 8) =>
      products.filter(p => p.tags.includes(genre)).slice(0, limit),
  }
}
