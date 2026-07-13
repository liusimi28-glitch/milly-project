import type { GamePrice } from '~/types/api/game'

export interface HomepageBanner {
  id: number
  title: string
  subtitle?: string
  cta: string
  href: string
  image: string
  bg_color?: string
}

export interface HomepageCategory {
  id: number
  name: string
  slug: string
  icon?: string
}

export interface HomepageGameCard {
  id: number
  title: string
  header_image: string
  capsule_image: string
  library_capsule_image: string
  vertical_capsule_image?: string
  prices: GamePrice[]
  base_token_amount: number
  original_token_amount: number
  discount_percent?: number
  is_free: boolean
  platform_windows: boolean
  platform_mac: boolean
  platform_linux: boolean
  badge?: string
  tags: string[]
}

export interface HomepageSection {
  items: HomepageGameCard[]
  total: number
}

export interface HomepageGenreSections {
  action: HomepageSection
  rpg: HomepageSection
  horror: HomepageSection
  indie: HomepageSection
  sports: HomepageSection
}

export interface HomepageBudgetDeals {
  under_5: HomepageSection
  under_10: HomepageSection
}

export interface HomepageSections {
  weekly_trends: HomepageSection
  bestsellers: HomepageSection
  genres: HomepageGenreSections
  budget_deals: HomepageBudgetDeals
  random_keys: HomepageSection
}

export interface HomepageMeta {
  locale: string
  generated_at: string
  cache_ttl_seconds: number
}

export interface HomepageResponse {
  banners: HomepageBanner[]
  category_quick_links: HomepageCategory[]
  sections: HomepageSections
  meta: HomepageMeta
}
