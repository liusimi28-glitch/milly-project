import type { ApiClient } from '~/lib/api/client'
import type { ListResult } from '~/types/api/common'
import type { CreateOrderRequest, Order } from '~/types/api/order'

export function fetchOrders(
  client: ApiClient,
  params?: { page?: number, size?: number },
): Promise<ListResult<Order>> {
  return client.get<ListResult<Order>>('/api/v1/client/order', params)
}

export function createOrder(client: ApiClient, body: CreateOrderRequest): Promise<Order> {
  return client.post<Order>('/api/v1/client/order', body)
}
