<script setup lang="ts">
const { isLoggedIn } = useApiAuth()
const { wallet, transactions, pending, error, refreshWallet, recharge } = useWallet()

const rechargeAmount = ref(10)
const rechargePending = ref(false)
const rechargeMessage = ref('')

async function handleRecharge() {
  rechargeMessage.value = ''
  rechargePending.value = true
  try {
    await recharge({
      amount: rechargeAmount.value,
      payment_provider: 'stripe',
    })
    rechargeMessage.value = '充值请求已创建'
  }
  catch (err) {
    rechargeMessage.value = err instanceof Error ? err.message : '充值失败'
  }
  finally {
    rechargePending.value = false
  }
}

useHead({ title: '我的钱包 | milly-project' })
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <h1 class="text-3xl font-bold text-g2a-text">
      我的钱包
    </h1>

    <div
      v-if="!isLoggedIn"
      class="mt-8 rounded-xl border border-g2a-border bg-white p-8 text-center text-sm text-g2a-muted"
    >
      请先登录以查看钱包
    </div>

    <template v-else>
      <p
        v-if="error"
        class="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        加载失败
        <button type="button" class="ml-2 font-medium underline" @click="refreshWallet()">
          重试
        </button>
      </p>

      <div v-else class="mt-8 space-y-6">
        <div class="rounded-xl border border-g2a-border bg-white p-6">
          <p class="text-sm text-g2a-muted">
            当前余额
          </p>
          <p v-if="pending" class="mt-2 text-sm text-g2a-muted">
            加载中…
          </p>
          <p v-else class="mt-2 text-4xl font-bold text-g2a-orange">
            {{ wallet?.currency ?? 'USD' }} {{ (wallet?.balance ?? 0).toFixed(2) }}
          </p>
        </div>

        <div class="rounded-xl border border-g2a-border bg-white p-6">
          <h2 class="text-lg font-semibold text-g2a-text">
            充值
          </h2>
          <div class="mt-4 flex flex-wrap items-end gap-3">
            <label class="flex flex-col gap-1 text-sm text-g2a-muted">
              金额
              <input
                v-model.number="rechargeAmount"
                type="number"
                min="1"
                step="1"
                class="h-10 w-32 rounded-md border border-g2a-border px-3 text-g2a-text"
              >
            </label>
            <button
              type="button"
              class="h-10 rounded-lg bg-g2a-orange px-4 text-sm font-medium text-white disabled:opacity-60"
              :disabled="rechargePending"
              @click="handleRecharge"
            >
              {{ rechargePending ? '处理中…' : '发起充值' }}
            </button>
          </div>
          <p v-if="rechargeMessage" class="mt-3 text-sm text-g2a-muted">
            {{ rechargeMessage }}
          </p>
        </div>

        <div class="rounded-xl border border-g2a-border bg-white p-6">
          <h2 class="text-lg font-semibold text-g2a-text">
            最近流水
          </h2>
          <ul v-if="transactions.length > 0" class="mt-4 space-y-3">
            <li
              v-for="tx in transactions"
              :key="tx.id"
              class="flex items-center justify-between border-b border-g2a-border pb-3 text-sm last:border-0"
            >
              <span class="text-g2a-text">{{ tx.description || tx.type }}</span>
              <span class="font-medium text-g2a-text">{{ tx.amount.toFixed(2) }}</span>
            </li>
          </ul>
          <p v-else class="mt-4 text-sm text-g2a-muted">
            暂无流水记录
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
