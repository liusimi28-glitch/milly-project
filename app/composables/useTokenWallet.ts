import { fetchTokenBalances, fetchTokenLedger } from '~/lib/api/token'

export function useTokenWallet() {
  const { authClient } = useApiClient()
  const { isLoggedIn } = useApiAuth()

  const { data: tokenBalances, pending: balancePending, error: balanceError, refresh: refreshTokenBalances } = useAsyncData(
    'token-balances',
    async () => {
      if (!isLoggedIn.value) return null
      try {
        return await fetchTokenBalances(authClient.value)
      }
      catch {
        return null
      }
    },
    { watch: [isLoggedIn] },
  )

  const { data: tokenLedger, pending: ledgerPending, error: ledgerError, refresh: refreshTokenLedger } = useAsyncData(
    'token-ledger',
    async () => {
      if (!isLoggedIn.value) return []
      try {
        const result = await fetchTokenLedger(authClient.value, { page: 1, page_size: 20 })
        return result.items
      }
      catch {
        return []
      }
    },
    { default: () => [], watch: [isLoggedIn] },
  )

  const tokenEnabled = computed(() => tokenBalances.value !== null)

  return {
    tokenBalances,
    tokenLedger,
    tokenEnabled,
    pending: computed(() => balancePending.value || ledgerPending.value),
    error: computed(() => balanceError.value || ledgerError.value),
    refreshTokenBalances,
    refreshTokenLedger,
  }
}
