<script setup lang="ts">
const { isLoggedIn } = useApiAuth()
const { wallet, transactions, pending, error, refreshWallet, recharge } = useWallet()
const { mallLink } = useProductRoute()

const presetAmounts = [10, 50, 100, 500]
const selectedAmount = ref(50)
const customAmount = ref<number | null>(null)
const paymentProvider = ref<'stripe' | 'abpay'>('abpay')
const rechargePending = ref(false)
const rechargeMessage = ref('')

const amount = computed(() => customAmount.value ?? selectedAmount.value)

async function handleRecharge() {
  rechargeMessage.value = ''
  rechargePending.value = true
  try {
    await recharge({
      amount: amount.value,
      payment_provider: paymentProvider.value,
    })
    rechargeMessage.value = '充值请求已创建，余额将稍后更新'
    customAmount.value = null
  }
  catch (err) {
    rechargeMessage.value = err instanceof Error ? err.message : '充值失败'
  }
  finally {
    rechargePending.value = false
  }
}

useHead({ title: '充值 | milly-project' })
</script>

<template>
  <div>
    <MallMallNav />

    <div class="mx-auto max-w-3xl px-4 py-8">
      <h1 class="text-3xl font-bold text-g2a-text">
        充值
      </h1>
      <p class="mt-2 text-sm text-g2a-muted">
        对接 POST /api/v1/client/wallet/recharge
      </p>

      <div
        v-if="!isLoggedIn"
        class="mt-8 rounded-xl border border-g2a-border bg-white p-8 text-center text-sm text-g2a-muted"
      >
        请先登录后再充值
      </div>

      <template v-else>
        <div class="mt-8 rounded-xl border border-g2a-border bg-white p-6">
          <p class="text-sm text-g2a-muted">
            当前余额
          </p>
          <p v-if="pending" class="mt-2 text-sm text-g2a-muted">
            加载中…
          </p>
          <p v-else class="mt-2 text-3xl font-bold text-g2a-orange">
            {{ wallet?.currency ?? 'USD' }} {{ (wallet?.balance ?? 0).toFixed(2) }}
          </p>
        </div>

        <div class="mt-6 rounded-xl border border-g2a-border bg-white p-6">
          <h2 class="text-lg font-semibold text-g2a-text">
            选择金额
          </h2>
          <div class="mt-4 flex flex-wrap gap-3">
            <button
              v-for="value in presetAmounts"
              :key="value"
              type="button"
              class="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
              :class="selectedAmount === value && customAmount === null
                ? 'border-g2a-orange bg-g2a-orange text-white'
                : 'border-g2a-border text-g2a-text hover:bg-g2a-gray'"
              @click="selectedAmount = value; customAmount = null"
            >
              ¥{{ value }}
            </button>
          </div>
          <label class="mt-4 block text-sm text-g2a-muted">
            自定义金额
            <input
              v-model.number="customAmount"
              type="number"
              min="1"
              step="1"
              class="mt-1 h-10 w-full rounded-md border border-g2a-border px-3 text-g2a-text"
              placeholder="输入其他金额"
            >
          </label>
        </div>

        <div class="mt-6 rounded-xl border border-g2a-border bg-white p-6">
          <h2 class="text-lg font-semibold text-g2a-text">
            支付方式
          </h2>
          <div class="mt-4 space-y-2">
            <label class="flex items-center gap-2 text-sm text-g2a-text">
              <input v-model="paymentProvider" type="radio" value="abpay">
              支付宝（abpay）
            </label>
            <label class="flex items-center gap-2 text-sm text-g2a-text">
              <input v-model="paymentProvider" type="radio" value="stripe">
              微信 / Stripe
            </label>
          </div>
          <button
            type="button"
            class="mt-6 h-11 w-full rounded-lg bg-g2a-orange text-sm font-semibold text-white disabled:opacity-60"
            :disabled="rechargePending || amount <= 0"
            @click="handleRecharge"
          >
            {{ rechargePending ? '处理中…' : `确认充值 ¥${amount}` }}
          </button>
          <p v-if="rechargeMessage" class="mt-3 text-sm text-g2a-muted">
            {{ rechargeMessage }}
          </p>
          <p v-if="error" class="mt-3 text-sm text-red-600">
            加载失败，请
            <button type="button" class="underline" @click="refreshWallet()">
              重试
            </button>
          </p>
        </div>

        <div class="mt-6 rounded-xl border border-g2a-border bg-white p-6">
          <h2 class="text-lg font-semibold text-g2a-text">
            最近充值记录
          </h2>
          <ul v-if="transactions.length > 0" class="mt-4 space-y-3">
            <li
              v-for="tx in transactions.slice(0, 5)"
              :key="tx.id"
              class="flex items-center justify-between border-b border-g2a-border pb-3 text-sm last:border-0"
            >
              <span class="text-g2a-text">{{ tx.description || tx.type }}</span>
              <span class="font-medium text-g2a-text">{{ tx.amount.toFixed(2) }}</span>
            </li>
          </ul>
          <p v-else class="mt-4 text-sm text-g2a-muted">
            暂无记录
          </p>
        </div>

        <NuxtLink
          :to="mallLink('/inventory')"
          class="mt-6 inline-flex text-sm font-medium text-g2a-blue hover:text-g2a-orange"
        >
          返回库存/余额 →
        </NuxtLink>
      </template>
    </div>
  </div>
</template>
