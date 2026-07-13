export interface TokenAmountView {
  balance: number
  frozen: number
  available: number
}

export interface TokenBalances {
  user_id: string
  main_token: TokenAmountView
  reward_token: TokenAmountView
  promo_token: TokenAmountView
  updated_at: string
}

export interface TokenLedgerItem {
  id: number
  user_id: string
  token_type: string
  change_amount: number
  balance_after: number
  biz_type: string
  biz_id: string
  remark: string
  created_at: string
}

export interface TokenLedgerList {
  items: TokenLedgerItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
