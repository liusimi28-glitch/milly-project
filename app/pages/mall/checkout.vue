<script setup lang="ts">
import { ApiError } from '~/lib/api/client'
import type { TokenType } from '~/types/api/order'

const { items, total, clear } = useCart()
const { isLoggedIn } = useApiAuth()
const { placeOrder } = useOrders()
const { mallLink } = useProductRoute()
const router = useRouter()

const step = ref(1)
const email = ref('')
const paymentMethod = ref<'token' | 'wallet'>('token')
const promoCode = ref('')
const tokenType = ref<TokenType>('promo_token')
const pending = ref(false)
const errorMessage = ref('')
const orderIds = ref<number[]>([])

const steps = ['确认商品', '填写信息', '支付', '完成']

function formatPrice(value: number) {
  return `${value.toFixed(2)} 代币`
}

async function submitOrder() {
  errorMessage.value = ''
  pending.value = true

  if (!isLoggedIn.value) {
    errorMessage.value = '请先登录后再结算'
    pending.value = false
    return
  }

  try {
    const created: number[] = []
    for (const item of items.value) {
      const order = await placeOrder({
        game_id: Number(item.productId),
        token_type: tokenType.value,
      })
      created.push(order.id)
    }
    orderIds.value = created
    clear()
    step.value = 4
  }
  catch (error) {
    if (error instanceof ApiError && error.isUnauthorized) {
      errorMessage.value = '请先登录后再结算'
    }
    else {
      errorMessage.value = error instanceof Error ? error.message : '创建订单失败'
    }
  }
  finally {
    pending.value = false
  }
}

function nextStep() {
  if (step.value === 1 && items.value.length === 0) {
    errorMessage.value = '购物车为空，请先添加商品'
    return
  }
  if (step.value === 2 && !email.value.trim()) {
    errorMessage.value = '请填写收货邮箱或账号'
    return
  }
  errorMessage.value = ''
  if (step.value === 3) {
    submitOrder()
    return
  }
  step.value += 1
}

useHead({ title: '结算 | milly-project' })

onMounted(() => {
  if (items.value.length === 0) {
    router.replace(mallLink('/cart'))
  }
})
</script>

<template>
  <div>
    <MallMallNav />

    <div class="mx-auto max-w-4xl px-4 py-8">
      <h1 class="text-3xl font-bold text-g2a-text">
        结算
      </h1>

      <ol class="mt-6 flex flex-wrap gap-2">
        <li
          v-for="(label, index) in steps"
          :key="label"
          class="rounded-full px-3 py-1 text-xs font-medium"
          :class="step === index + 1 ? 'bg-g2a-orange text-white' : 'bg-g2a-gray text-g2a-muted'"
        >
          {{ index + 1 }}. {{ label }}
        </li>
      </ol>

      <p
        v-if="errorMessage"
        class="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        {{ errorMessage }}
      </p>

      <div class="mt-8 rounded-xl border border-g2a-border bg-white p-6">
        <div v-if="step === 1" class="space-y-4">
          <h2 class="text-lg font-semibold text-g2a-text">
            确认商品
          </h2>
          <ul class="divide-y divide-g2a-border">
            <li
              v-for="item in items"
              :key="item.id"
              class="flex items-center justify-between py-3 text-sm"
            >
              <span class="text-g2a-text">{{ item.title }} × {{ item.quantity }}</span>
              <span class="font-medium text-g2a-orange">{{ formatPrice(item.unitPrice * item.quantity) }}</span>
            </li>
          </ul>
          <p class="text-right text-base font-bold text-g2a-text">
            合计 {{ formatPrice(total) }}
          </p>
        </div>

        <div v-else-if="step === 2" class="space-y-4">
          <h2 class="text-lg font-semibold text-g2a-text">
            填写信息
          </h2>
          <label class="block text-sm text-g2a-muted">
            收货邮箱 / 账号
            <input
              v-model="email"
              type="email"
              class="mt-1 h-10 w-full rounded-md border border-g2a-border px-3 text-g2a-text"
              placeholder="you@example.com"
            >
          </label>
          <label class="block text-sm text-g2a-muted">
            优惠码（可选）
            <input
              v-model="promoCode"
              type="text"
              class="mt-1 h-10 w-full rounded-md border border-g2a-border px-3 text-g2a-text"
              placeholder="PROMO2026"
            >
          </label>
          <fieldset class="space-y-2">
            <legend class="text-sm text-g2a-muted">
              支付方式
            </legend>
            <label class="flex items-center gap-2 text-sm text-g2a-text">
              <input v-model="paymentMethod" type="radio" value="token">
              代币支付（对接 POST /api/v1/client/order）
            </label>
            <label class="flex items-center gap-2 text-sm text-g2a-text">
              <input v-model="paymentMethod" type="radio" value="wallet">
              钱包余额（待后端支持）
            </label>
          </fieldset>
        </div>

        <div v-else-if="step === 3" class="space-y-4">
          <h2 class="text-lg font-semibold text-g2a-text">
            确认支付
          </h2>
          <p class="text-sm text-g2a-muted">
            将使用代币支付，应付 {{ formatPrice(total) }}。
          </p>
          <label class="block text-sm text-g2a-muted">
            代币类型
            <select v-model="tokenType" class="mt-1 h-10 w-full rounded-md border border-g2a-border px-3 text-g2a-text">
              <option value="promo_token">
                促销代币
              </option>
              <option value="main_token">
                主代币
              </option>
              <option value="reward_token">
                奖励代币
              </option>
            </select>
          </label>
        </div>

        <div v-else class="space-y-4 text-center">
          <h2 class="text-2xl font-bold text-g2a-text">
            支付完成
          </h2>
          <p class="text-sm text-g2a-muted">
            感谢您的购买！
          </p>
          <p v-if="orderIds.length > 0" class="text-sm text-g2a-text">
            订单号：{{ orderIds.join(', ') }}
          </p>
          <div class="flex flex-wrap justify-center gap-3 pt-4">
            <NuxtLink
              :to="mallLink('/inventory')"
              class="rounded-lg bg-g2a-orange px-4 py-2 text-sm font-medium text-white"
            >
              查看库存
            </NuxtLink>
            <NuxtLink
              :to="mallLink()"
              class="rounded-lg border border-g2a-border px-4 py-2 text-sm font-medium text-g2a-text"
            >
              继续购物
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-if="step < 4" class="mt-6 flex justify-end gap-3">
        <NuxtLink
          :to="mallLink('/cart')"
          class="rounded-lg border border-g2a-border px-4 py-2 text-sm font-medium text-g2a-text"
        >
          返回购物车
        </NuxtLink>
        <button
          type="button"
          class="rounded-lg bg-g2a-orange px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          :disabled="pending"
          @click="nextStep"
        >
          {{ pending ? '处理中…' : step === 3 ? '确认支付' : '下一步' }}
        </button>
      </div>
    </div>
  </div>
</template>
