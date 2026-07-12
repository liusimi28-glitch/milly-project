export interface ApiResponse<T> {
  data: T
  error_no: number
  error_msg: string
  request_id: string
}

export interface ListResult<T> {
  items: T[]
  total: number
}

export type PaymentMethod = 'wallet' | 'stripe' | 'abpay'
export type OrderStatus = 'pending' | 'paid' | 'refunded'
export type AcquireMethod = 'purchase' | 'gift' | 'admin_grant'
export type ControllerSupport = 'none' | 'partial' | 'full'
export type GameStatus = 'draft' | 'review' | 'published' | 'rejected' | 'delisted'
export type PromotionStatus = 'upcoming' | 'active' | 'ended'
export type RechargeStatus = 'pending' | 'success' | 'failed'
export type UserRole = 'admin' | 'developer' | 'player'
export type UserStatus = 'active' | 'inactive' | 'banned'
