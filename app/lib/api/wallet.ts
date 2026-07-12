import type { ApiClient } from '~/lib/api/client'
import type { ListResult } from '~/types/api/common'
import type { RechargeRecord, RechargeRequest, Transaction, Wallet } from '~/types/api/wallet'

export function fetchWallet(client: ApiClient): Promise<Wallet> {
  return client.get<Wallet>('/api/v1/client/wallet')
}

export function rechargeWallet(
  client: ApiClient,
  body: RechargeRequest,
): Promise<RechargeRecord> {
  return client.post<RechargeRecord>('/api/v1/client/wallet/recharge', body)
}

export function fetchTransactions(
  client: ApiClient,
  params?: { page?: number, size?: number },
): Promise<ListResult<Transaction>> {
  return client.get<ListResult<Transaction>>('/api/v1/client/wallet/transaction', params)
}
