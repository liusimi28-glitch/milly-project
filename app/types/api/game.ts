export interface GameDetailTranslation {
  locale: string
  title: string
  short_description: string
  about_description?: string
}

export interface GameCompany {
  role: 'developer' | 'publisher' | string
  name: string
}

export interface GameTag {
  code: string
  name: string
  tag_type?: string
}

export interface GameSupportedLanguage {
  language_code: string
  has_full_audio?: boolean
}

export interface GameAssetTranslation {
  locale: string
  title: string
}

export interface GameAsset {
  id: number
  role: 'screenshot' | 'trailer' | 'build' | string
  asset_type: 'image' | 'video' | string
  url: string
  thumbnail_url?: string
  is_highlight?: boolean
  translations?: GameAssetTranslation[]
}

export interface GameDetailResponse {
  id: number
  external_app_id?: number
  header_image: string
  background_image?: string
  background_raw_image?: string
  currency: string
  base_price_cents: number
  original_price_cents: number
  price_formatted?: string
  original_price_formatted?: string
  discount_percent?: number
  is_free: boolean
  platform_windows: boolean
  platform_mac: boolean
  platform_linux: boolean
  release_date?: string
  coming_soon: boolean
  metacritic_score?: number
  metacritic_url?: string
  recommendations_total?: number
  required_age?: number
  support_url?: string
  support_email?: string
  translations: GameDetailTranslation
  companies?: GameCompany[]
  tags?: GameTag[]
  supported_languages?: GameSupportedLanguage[]
  assets?: GameAsset[]
}

export interface GameListItem {
  id: number
  title: string
  header_image: string
  capsule_image: string
  library_capsule_image: string
  vertical_capsule_image?: string
  currency: string
  base_price_cents: number
  original_price_cents: number
  price_formatted: string
  original_price_formatted: string
  discount_percent?: number
  is_free: boolean
  platform_windows: boolean
  platform_mac: boolean
  platform_linux: boolean
  badge?: string
  tags: string[]
}

export interface GameListResponse {
  items: GameListItem[]
  total: number
}
