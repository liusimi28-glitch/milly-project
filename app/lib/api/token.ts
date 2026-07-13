import type { ApiClient } from '~/lib/api/client'
import type { TokenBalances, TokenLedgerList } from '~/types/api/token'

export function fetchTokenBalances(client: ApiClient): Promise<TokenBalances> {
  return client.get<TokenBalances>('/api/v1/client/token/balances')
}

export function fetchTokenLedger(
  client: ApiClient,
  params?: { page?: number, page_size?: number, token_type?: string },
): Promise<TokenLedgerList> {
  return client.get<TokenLedgerList>('/api/v1/client/token/ledger', params)
}
