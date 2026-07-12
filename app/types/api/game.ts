import type { ControllerSupport, GameStatus } from '~/types/api/common'

export interface GameTag {
  id?: number
  code: string
  name: string
  tag_type?: string
}

export interface GameSupportedLanguage {
  language_code: string
  has_full_audio?: boolean
}

export interface GameAsset {
  id: number
  role: 'header' | 'capsule' | 'screenshot' | 'trailer' | 'background' | 'build' | string
  asset_type: 'image' | 'video' | 'build' | string
  url: string
  thumbnail_url?: string
  external_id?: string
  is_highlight?: boolean
  metadata?: string
  title?: string
  sort_order?: number
  status?: GameStatus
}

export interface GameListItem {
  id: number
  locale: string
  title: string
  short_description?: string
  header_image: string
  main_capsule_image?: string
  currency: string
  base_price_cents: number
  original_price_cents: number
  price_formatted: string
  original_price_formatted: string
  is_free: boolean
  coming_soon: boolean
  early_access?: boolean
  release_date?: string
  status?: GameStatus
  platform_windows: boolean
  platform_mac: boolean
  platform_linux: boolean
  tags?: GameTag[]
}

export interface GameDetail extends GameListItem {
  developer_id?: string
  external_app_id?: string
  external_source?: string
  required_age?: number
  website?: string
  controller_support?: ControllerSupport
  capsule_image?: string
  capsule_image_v5?: string
  background_image?: string
  background_raw_image?: string
  vertical_capsule_image?: string
  library_capsule_image?: string
  library_hero_image?: string
  library_logo_image?: string
  library_header_image?: string
  icon_image?: string
  app_icon_image?: string
  about_description?: string
  detailed_description?: string
  pc_requirements_min?: string
  pc_requirements_rec?: string
  mac_requirements_min?: string
  mac_requirements_rec?: string
  linux_requirements_min?: string
  linux_requirements_rec?: string
  metacritic_score?: number
  metacritic_url?: string
  recommendations_total?: number
  achievements_total?: number
  support_url?: string
  support_email?: string
  developers?: string[]
  publishers?: string[]
  supported_languages?: GameSupportedLanguage[]
  assets?: GameAsset[]
}

/** @deprecated Use GameDetail */
export type GameDetailResponse = GameDetail
