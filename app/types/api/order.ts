import type { OrderStatus, PaymentMethod } from '~/types/api/common'

export type TokenType = 'main_token' | 'reward_token' | 'promo_token'

export interface Order {
  id: number
  game_id: number
  player_id: string
  status: OrderStatus
  payment_method?: PaymentMethod
  paid_amount?: number
  original_price?: number
  token_type?: string
  token_amount?: string
  created_at?: string
  updated_at?: string
}

export interface CreateOrderRequest {
  game_id: number
  token_type: TokenType
}
