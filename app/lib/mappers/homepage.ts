import type {
  HomepageBanner,
  HomepageCategory,
  HomepageGameCard,
  HomepageResponse,
} from '~/types/api/homepage'
import type { Banner, Category, Product, ProductBadge } from '~/types'
import { GAME_IMAGE_PLACEHOLDER, resolveVerticalGameImage } from '~/lib/game-images'

const slugIconFallback: Record<string, string> = {
  games: 'layout-grid',
  steam: 'steam',
  xbox: 'xbox',
  playstation: 'playstation',
  gift: 'gift',
  software: 'monitor',
  random: 'dice-5',
  coins: 'coins',
  mobile: 'smartphone',
  learning: 'graduation-cap',
  crypto: 'bitcoin',
}

export interface HomepageViewModel {
  banners: Banner[]
  categoryQuickLinks: Category[]
  weeklyTrends: Product[]
  bestsellers: Product[]
  genres: Record<string, Product[]>
  budgetUnder5: Product[]
  budgetUnder10: Product[]
  randomKeys: Product[]
  meta: HomepageResponse['meta'] | null
}

const emptyViewModel: HomepageViewModel = {
  banners: [],
  categoryQuickLinks: [],
  weeklyTrends: [],
  bestsellers: [],
  genres: {
    action: [],
    rpg: [],
    horror: [],
    indie: [],
    sports: [],
  },
  budgetUnder5: [],
  budgetUnder10: [],
  randomKeys: [],
  meta: null,
}

export function emptyHomepageViewModel(): HomepageViewModel {
  return {
    ...emptyViewModel,
    genres: { ...emptyViewModel.genres },
  }
}

export function mapHomepageResponse(raw: HomepageResponse): HomepageViewModel {
  return {
    banners: raw.banners.map(mapBanner),
    categoryQuickLinks: raw.category_quick_links.map(mapCategory),
    weeklyTrends: raw.sections.weekly_trends.items.map(mapGameCardToProduct),
    bestsellers: raw.sections.bestsellers.items.map(mapGameCardToProduct),
    genres: {
      action: raw.sections.genres.action.items.map(mapGameCardToProduct),
      rpg: raw.sections.genres.rpg.items.map(mapGameCardToProduct),
      horror: raw.sections.genres.horror.items.map(mapGameCardToProduct),
      indie: raw.sections.genres.indie.items.map(mapGameCardToProduct),
      sports: raw.sections.genres.sports.items.map(mapGameCardToProduct),
    },
    budgetUnder5: raw.sections.budget_deals.under_5.items.map(mapGameCardToProduct),
    budgetUnder10: raw.sections.budget_deals.under_10.items.map(mapGameCardToProduct),
    randomKeys: raw.sections.random_keys.items.map(mapGameCardToProduct),
    meta: raw.meta,
  }
}

function mapBanner(banner: HomepageBanner): Banner {
  return {
    id: String(banner.id),
    title: banner.title,
    subtitle: banner.subtitle,
    cta: banner.cta,
    href: normalizeHref(banner.href),
    image: banner.image || GAME_IMAGE_PLACEHOLDER,
    bgColor: banner.bg_color,
  }
}

function mapCategory(category: HomepageCategory): Category {
  return {
    id: String(category.id),
    name: category.name,
    slug: category.slug,
    icon: category.icon || slugIconFallback[category.slug] || 'package',
  }
}

function normalizeHref(href: string): string {
  if (href.startsWith('/promotion/')) {
    return href.replace('/promotion/', '/product/')
  }
  return href
}

export function mapGameCardToProduct(card: HomepageGameCard): Product {
  const price = card.is_free ? 0 : card.base_token_amount
  const originalPrice = card.original_token_amount > 0
    ? card.original_token_amount
    : undefined

  return {
    id: String(card.id),
    title: card.title,
    platform: derivePlatform(card),
    region: 'Global',
    price,
    originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
    discount: card.discount_percent || undefined,
    image: resolveVerticalGameImage(card),
    seller: 'SiteA',
    sellerRating: 4.5,
    badge: card.badge as ProductBadge | undefined,
    tags: card.tags ?? [],
  }
}

export function derivePlatform(card: Pick<HomepageGameCard, 'platform_windows' | 'platform_mac' | 'platform_linux'>): Product['platform'] {
  if (card.platform_windows) return 'Steam'
  if (card.platform_mac) return 'GOG'
  if (card.platform_linux) return 'Epic'
  return 'Steam'
}
