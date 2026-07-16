<script setup lang="ts">
const { isLoggedIn } = useApiAuth()
const { wallet, transactions, pending: walletPending, error: walletError, refreshWallet } = useWallet()
const { entries, pending: libraryPending, error: libraryError, refresh: refreshLibrary } = useLibrary()
const { tokenBalances, tokenEnabled, tokenLedger, pending: tokenPending } = useTokenWallet()
const { mallLink } = useProductRoute()

const statusFilter = ref<'all' | 'owned'>('all')

const filteredEntries = computed(() => {
  if (statusFilter.value === 'all') return entries.value ?? []
  return (entries.value ?? []).filter(entry => entry.library.acquire_method === 'purchase')
})

const pending = computed(() => walletPending.value || libraryPending.value || tokenPending.value)
const error = computed(() => walletError.value || libraryError.value)

function refreshAll() {
  refreshWallet()
  refreshLibrary()
}

useHead({ title: '库存与余额 | milly-project' })
</script>

<template>
  <div>
    <MallMallNav />

    <div class="mx-auto max-w-7xl px-4 py-8">
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-g2a-text">
            库存与余额
          </h1>
          <p class="mt-2 text-sm text-g2a-muted">
            数据来源：GET /api/v1/client/wallet、/library、/token/balances
          </p>
        </div>
        <NuxtLink
          :to="mallLink('/recharge')"
          class="rounded-lg bg-g2a-orange px-4 py-2 text-sm font-semibold text-white hover:bg-g2a-orange/90"
        >
          充值
        </NuxtLink>
      </div>

      <div
        v-if="!isLoggedIn"
        class="rounded-xl border border-g2a-border bg-white p-8 text-center text-sm text-g2a-muted"
      >
        请先登录以查看库存与余额
      </div>

      <template v-else>
        <p
          v-if="error"
          class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          加载失败
          <button type="button" class="ml-2 font-medium underline" @click="refreshAll()">
            重试
          </button>
        </p>

        <div class="grid gap-6 lg:grid-cols-3">
          <div class="rounded-xl border border-g2a-border bg-white p-6 lg:col-span-1">
            <p class="text-sm text-g2a-muted">
              钱包余额
            </p>
            <p v-if="pending" class="mt-2 text-sm text-g2a-muted">
              加载中…
            </p>
            <p v-else class="mt-2 text-4xl font-bold text-g2a-orange">
              {{ wallet?.currency ?? 'USD' }} {{ (wallet?.balance ?? 0).toFixed(2) }}
            </p>
            <div v-if="tokenEnabled" class="mt-6 space-y-2 text-sm">
              <p class="font-medium text-g2a-text">
                代币余额
              </p>
              <p class="text-g2a-muted">
                主代币：{{ tokenBalances?.main_token?.available ?? '0' }}
              </p>
              <p class="text-g2a-muted">
                奖励代币：{{ tokenBalances?.reward_token?.available ?? '0' }}
              </p>
              <p class="text-g2a-muted">
                促销代币：{{ tokenBalances?.promo_token?.available ?? '0' }}
              </p>
            </div>
          </div>

          <div class="rounded-xl border border-g2a-border bg-white p-6 lg:col-span-2">
            <div class="mb-4 flex items-center justify-between gap-3">
              <h2 class="text-lg font-semibold text-g2a-text">
                游戏库存
              </h2>
              <select
                v-model="statusFilter"
                class="h-9 rounded-md border border-g2a-border px-3 text-sm text-g2a-text"
              >
                <option value="all">
                  全部
                </option>
                <option value="owned">
                  已购买
                </option>
              </select>
            </div>

            <div v-if="libraryPending && filteredEntries.length === 0" class="grid grid-cols-2 gap-4 md:grid-cols-3">
              <ProductProductCardSkeleton v-for="index in 3" :key="index" />
            </div>

            <div
              v-else-if="filteredEntries.length > 0"
              class="grid grid-cols-2 gap-4 md:grid-cols-3"
            >
              <div
                v-for="entry in filteredEntries"
                :key="entry.library.id"
                class="space-y-2"
              >
                <ProductProductCard
                  v-if="entry.product"
                  :product="entry.product"
                />
                <div
                  v-else
                  class="rounded-lg border border-g2a-border bg-g2a-gray p-4 text-sm text-g2a-muted"
                >
                  游戏 #{{ entry.library.game_id }}
                </div>
                <p class="text-xs text-g2a-muted">
                  购买方式：{{ entry.library.acquire_method }} · 游玩 {{ entry.library.play_time_minutes }} 分钟
                </p>
              </div>
            </div>

            <p v-else class="text-sm text-g2a-muted">
              暂无库存游戏
            </p>
          </div>
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-2">
          <div class="rounded-xl border border-g2a-border bg-white p-6">
            <h2 class="text-lg font-semibold text-g2a-text">
              钱包流水
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
              暂无流水
            </p>
          </div>

          <div class="rounded-xl border border-g2a-border bg-white p-6">
            <h2 class="text-lg font-semibold text-g2a-text">
              代币流水
            </h2>
            <ul v-if="tokenLedger.length > 0" class="mt-4 space-y-3">
              <li
                v-for="tx in tokenLedger"
                :key="tx.id"
                class="flex items-center justify-between border-b border-g2a-border pb-3 text-sm last:border-0"
              >
                <span class="text-g2a-text">{{ tx.biz_type }} · {{ tx.token_type }}</span>
                <span class="font-medium text-g2a-text">{{ tx.change_amount }}</span>
              </li>
            </ul>
            <p v-else class="mt-4 text-sm text-g2a-muted">
              暂无代币流水
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
