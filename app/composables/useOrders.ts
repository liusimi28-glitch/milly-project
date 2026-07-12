import { createOrder, fetchOrders } from '~/lib/api/order'
import type { CreateOrderRequest, Order } from '~/types/api/order'

export function useOrders() {
  const { authClient } = useApiClient()
  const { isLoggedIn } = useApiAuth()

  const { data, pending, error, refresh } = useAsyncData<Order[]>(
    'user-orders',
    async () => {
      if (!isLoggedIn.value) return []
      const result = await fetchOrders(authClient.value, { page: 1, size: 50 })
      return result.items
    },
    {
      default: () => [],
      watch: [isLoggedIn],
    },
  )

  async function placeOrder(body: CreateOrderRequest) {
    const order = await createOrder(authClient.value, body)
    await refresh()
    return order
  }

  return {
    orders: data,
    pending,
    error,
    refresh,
    placeOrder,
  }
}
