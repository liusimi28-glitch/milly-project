<script setup lang="ts">
const { isLoggedIn } = useApiAuth()
const { orders, pending, error, refresh } = useOrders()
const locale = useHomepageLocale()

const statusLabel: Record<string, string> = {
  pending: '待支付',
  paid: '已支付',
  refunded: '已退款',
}

useHead({ title: '我的订单 | milly-project' })
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <h1 class="text-3xl font-bold text-g2a-text">
      我的订单
    </h1>
    <p class="mt-2 text-sm text-g2a-muted">
      查看购买记录与支付状态
    </p>

    <div
      v-if="!isLoggedIn"
      class="mt-8 rounded-xl border border-g2a-border bg-white p-8 text-center text-sm text-g2a-muted"
    >
      请先登录以查看订单
    </div>

    <p
      v-else-if="error"
      class="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      加载失败
      <button type="button" class="ml-2 font-medium underline" @click="refresh()">
        重试
      </button>
    </p>

    <div v-else-if="pending" class="mt-8 text-sm text-g2a-muted">
      加载中…
    </div>

    <ul v-else-if="orders.length > 0" class="mt-8 space-y-4">
      <li
        v-for="order in orders"
        :key="order.id"
        class="rounded-xl border border-g2a-border bg-white p-4"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="font-medium text-g2a-text">
              订单 #{{ order.id }}
            </p>
            <p class="mt-1 text-sm text-g2a-muted">
              游戏 ID：{{ order.game_id }}
            </p>
            <p v-if="order.created_at" class="mt-1 text-xs text-g2a-muted">
              {{ order.created_at }}
            </p>
          </div>
          <div class="text-right">
            <span class="rounded bg-g2a-gray px-2 py-1 text-xs font-medium text-g2a-text">
              {{ statusLabel[order.status] ?? order.status }}
            </span>
            <p v-if="order.paid_amount != null" class="mt-2 text-sm font-semibold text-g2a-orange">
              {{ order.paid_amount.toFixed(2) }}
            </p>
          </div>
        </div>
        <NuxtLink
          :to="`/product/${order.game_id}?locale=${encodeURIComponent(locale)}`"
          class="mt-3 inline-flex text-sm text-g2a-blue hover:text-g2a-orange"
        >
          查看游戏 →
        </NuxtLink>
      </li>
    </ul>

    <div v-else class="mt-8 rounded-xl border border-g2a-border bg-white p-12 text-center text-sm text-g2a-muted">
      暂无订单记录
    </div>
  </div>
</template>
