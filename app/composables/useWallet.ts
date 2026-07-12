import { fetchTransactions, fetchWallet, rechargeWallet } from '~/lib/api/wallet'
import type { RechargeRequest } from '~/types/api/wallet'

export function useWallet() {
  const { authClient } = useApiClient()
  const { isLoggedIn } = useApiAuth()

  const { data: wallet, pending: walletPending, error: walletError, refresh: refreshWallet } = useAsyncData(
    'user-wallet',
    async () => {
      if (!isLoggedIn.value) return null
      return fetchWallet(authClient.value)
    },
    { watch: [isLoggedIn] },
  )

  const { data: transactions, pending: txPending, error: txError, refresh: refreshTransactions } = useAsyncData(
    'wallet-transactions',
    async () => {
      if (!isLoggedIn.value) return []
      const result = await fetchTransactions(authClient.value, { page: 1, size: 20 })
      return result.items
    },
    { default: () => [], watch: [isLoggedIn] },
  )

  async function recharge(body: RechargeRequest) {
    const record = await rechargeWallet(authClient.value, body)
    await Promise.all([refreshWallet(), refreshTransactions()])
    return record
  }

  return {
    wallet,
    transactions,
    pending: computed(() => walletPending.value || txPending.value),
    error: computed(() => walletError.value || txError.value),
    refreshWallet,
    refreshTransactions,
    recharge,
  }
}
