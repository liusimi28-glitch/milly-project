import type { PromotionStatus } from '~/types/api/common'

export interface GamePromotion {
  id: number
  promotion_id: number
  game_id: number
  discount_type?: string
  discount_value?: number
  active_price?: number
  created_at?: string
  updated_at?: string
}

export interface Promotion {
  id: number
  title: string
  description?: string
  status: PromotionStatus
  start_time?: string
  end_time?: string
  game_promotions?: GamePromotion[]
  created_at?: string
  updated_at?: string
}
