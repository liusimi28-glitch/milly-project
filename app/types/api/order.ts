import type { OrderStatus, PaymentMethod } from '~/types/api/common'

export interface Order {
  id: number
  game_id: number
  player_id: string
  status: OrderStatus
  payment_method?: PaymentMethod
  paid_amount?: number
  original_price?: number
  created_at?: string
  updated_at?: string
}

export interface CreateOrderRequest {
  game_id: number
}
