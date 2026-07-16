/**
 * TODO: replace with backend cart API when available:
 * GET/POST/PUT/DELETE /api/v1/client/cart
 */
import type { Product, ProductDetail } from '~/types'

export interface CartItem {
  id: string
  productId: string
  title: string
  image: string
  unitPrice: number
  originalPrice?: number
  currency: string
  quantity: number
}

const STORAGE_KEY = 'mall-cart-v1'

function readStorage(): CartItem[] {
  if (!import.meta.client) return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    return Array.isArray(parsed) ? parsed : []
  }
  catch {
    return []
  }
}

function writeStorage(items: CartItem[]) {
  if (!import.meta.client) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function toCartItem(product: Product | ProductDetail, quantity: number): CartItem {
  const detail = product as ProductDetail
  return {
    id: `${product.id}-${Date.now()}`,
    productId: product.id,
    title: product.title,
    image: product.image,
    unitPrice: product.price,
    originalPrice: product.originalPrice,
    currency: detail.currency ?? '代币',
    quantity,
  }
}

export function useCart() {
  const items = useState<CartItem[]>('mall-cart-items', () => [])

  if (import.meta.client && items.value.length === 0) {
    items.value = readStorage()
  }

  watch(items, (value) => {
    writeStorage(value)
  }, { deep: true })

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0))

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0))

  const originalSubtotal = computed(() =>
    items.value.reduce((sum, item) => sum + (item.originalPrice ?? item.unitPrice) * item.quantity, 0))

  const discountTotal = computed(() =>
    Math.max(0, originalSubtotal.value - subtotal.value))

  const shippingFee = computed(() => 0)

  const total = computed(() => subtotal.value + shippingFee.value)

  function addItem(product: Product | ProductDetail, quantity = 1) {
    const existing = items.value.find(item => item.productId === product.id)
    if (existing) {
      existing.quantity += quantity
      return
    }

    items.value.push(toCartItem(product, quantity))
  }

  function updateQuantity(itemId: string, quantity: number) {
    const item = items.value.find(entry => entry.id === itemId)
    if (!item) return

    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    item.quantity = quantity
  }

  function removeItem(itemId: string) {
    items.value = items.value.filter(entry => entry.id !== itemId)
  }

  function clear() {
    items.value = []
  }

  return {
    items,
    itemCount,
    subtotal,
    originalSubtotal,
    discountTotal,
    shippingFee,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  }
}
