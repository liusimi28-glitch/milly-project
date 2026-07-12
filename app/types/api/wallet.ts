import type { PaymentMethod, RechargeStatus } from '~/types/api/common'

export interface Wallet {
  id: number
  user_id: string
  balance: number
  currency: string
  created_at?: string
  updated_at?: string
}

export interface Transaction {
  id: number
  user_id: string
  amount: number
  type: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface RechargeRecord {
  id: number
  user_id: string
  amount: number
  status: RechargeStatus
  external_tx_id?: string
  created_at?: string
  updated_at?: string
}

export interface RechargeRequest {
  amount: number
  payment_provider: PaymentMethod
}
