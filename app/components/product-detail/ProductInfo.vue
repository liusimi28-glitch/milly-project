<script setup lang="ts">
import { ShoppingCartIcon, ZapIcon } from '@lucide/vue'
import { ApiError } from '~/lib/api/client'
import type { ProductDetail } from '~/types'
import type { TokenType } from '~/types/api/order'
import { Button } from '@/components/ui/button'
import { tokenPriceForType } from '~/lib/mappers/gameDetail'
import { cn } from '@/lib/utils'

const props = defineProps<{
  product: ProductDetail
}>()

const quantity = defineModel<number>('quantity', { default: 1 })

const { isLoggedIn } = useApiAuth()
const { placeOrder } = useOrders()
const { addItem } = useCart()
const { tokenBalances, tokenEnabled, refreshTokenBalances } = useTokenWallet()
const { withLocale, mallLink } = useProductRoute()
const router = useRouter()

const cartFeedback = ref<'idle' | 'added'>('idle')
const isBuying = ref(false)
const buyError = ref('')
const buySuccess = ref(false)
const selectedTokenType = ref<TokenType>('promo_token')

const TOKEN_OPTIONS: { type: TokenType, label: string }[] = [
  { type: 'promo_token', label: '促销代币' },
  { type: 'main_token', label: '主代币' },
  { type: 'reward_token', label: '奖励代币' },
]

const maxQuantity = computed(() => Math.min(props.product.stockCount, 10))

const selectedTokenPrice = computed(() =>
  tokenPriceForType(props.product.prices, selectedTokenType.value))

const displayPrice = computed(() => {
  if (props.product.isFree) return '免费'
  const amount = selectedTokenPrice.value || props.product.price
  return `${amount} 代币`
})
const displayOriginalPrice = computed(() => {
  const row = props.product.prices?.find(p => p.currency_type === selectedTokenType.value)
  const original = row?.original_token_amount ?? props.product.originalPrice ?? 0
  const base = selectedTokenPrice.value || props.product.price
  if (original > base) return `${original} 代币`
  return undefined
})

const showTokenCheckout = computed(() => !props.product.isFree && props.product.inStock)

const selectedTokenAvailable = computed(() => {
  if (!tokenBalances.value) return 0
  return tokenBalances.value[selectedTokenType.value]?.available ?? 0
})

const hasSufficientToken = computed(() => {
  if (props.product.isFree) return false
  return selectedTokenAvailable.value >= selectedTokenPrice.value
})

const canBuyNow = computed(() => {
  if (!props.product.inStock || props.product.isFree) return false
  if (!tokenEnabled.value) return false
  return hasSufficientToken.value
})

function pickDefaultTokenType() {
  if (!tokenBalances.value) {
    selectedTokenType.value = 'promo_token'
    return
  }
  const priority: TokenType[] = ['promo_token', 'main_token', 'reward_token']
  for (const type of priority) {
    const available = tokenBalances.value[type]?.available ?? 0
    const price = tokenPriceForType(props.product.prices, type)
    if (available >= price && price > 0) {
      selectedTokenType.value = type
      return
    }
  }
  selectedTokenType.value = 'promo_token'
}

watch([tokenBalances, () => props.product.prices], pickDefaultTokenType, { immediate: true })

async function handleAddToCart() {
  if (!props.product.inStock) return

  addItem(props.product, quantity.value)
  cartFeedback.value = 'added'
  await new Promise(resolve => setTimeout(resolve, 1200))
  cartFeedback.value = 'idle'
}

async function handleBuyNow() {
  if (!props.product.inStock) return

  buyError.value = ''
  buySuccess.value = false

  if (!isLoggedIn.value) {
    buyError.value = '请先登录后再购买'
    return
  }

  if (props.product.isFree) {
    buyError.value = '免费游戏暂不支持在线获取，请稍后再试'
    return
  }

  if (!tokenEnabled.value) {
    buyError.value = '代币钱包未开启，暂无法购买'
    return
  }

  if (!hasSufficientToken.value) {
    buyError.value = '所选代币余额不足，请前往钱包查看或更换支付方式'
    return
  }

  isBuying.value = true
  try {
    await placeOrder({
      game_id: Number(props.product.id),
      token_type: selectedTokenType.value,
    })
    buySuccess.value = true
    await refreshTokenBalances()
    await router.push(mallLink('/inventory'))
  }
  catch (error) {
    if (error instanceof ApiError && error.isUnauthorized) {
      buyError.value = '请先登录后再购买'
    }
    else {
      buyError.value = error instanceof Error ? error.message : '购买失败，请稍后重试'
    }
  }
  finally {
    isBuying.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div>
      <div class="mb-3 flex flex-wrap items-center gap-2">
        <span
          v-if="product.comingSoon"
          class="rounded bg-g2a-blue px-2 py-0.5 text-xs font-semibold text-white"
        >
          即将推出
        </span>
        <span
          v-if="product.isFree"
          class="rounded bg-green-600 px-2 py-0.5 text-xs font-semibold text-white"
        >
          免费
        </span>
        <span
          v-if="product.requiredAge"
          class="rounded border border-g2a-border bg-g2a-gray px-2 py-0.5 text-xs font-medium text-g2a-text"
        >
          {{ product.requiredAge }}+
        </span>
      </div>

      <h1 class="text-2xl font-bold leading-tight text-g2a-text sm:text-3xl">
        {{ product.title }}
      </h1>

      <div class="mt-3 flex flex-wrap items-center gap-3">
        <div
          v-if="product.metacriticScore"
          class="inline-flex items-center gap-2 rounded border border-g2a-border bg-g2a-gray/60 px-2.5 py-1"
        >
          <ProductDetailStarRating
            :rating="product.averageRating"
            size="sm"
            :show-value="false"
          />
          <span class="text-sm font-semibold text-g2a-text">
            Metacritic {{ product.metacriticScore }}
          </span>
        </div>
        <span
          v-if="product.reviewCount > 0"
          class="text-sm text-g2a-muted"
        >
          {{ product.reviewCount.toLocaleString() }} 条推荐
        </span>
        <span
          v-if="product.releaseDate"
          class="text-sm text-g2a-muted"
        >
          发行日期：{{ product.releaseDate }}
        </span>
      </div>
    </div>

    <p class="text-sm leading-relaxed text-g2a-muted">
      {{ product.shortDescription }}
    </p>

    <div
      v-if="product.tags.length > 0"
      class="flex flex-wrap gap-2"
    >
      <span
        v-for="tag in product.tags"
        :key="tag"
        class="rounded border border-g2a-border bg-g2a-gray px-2.5 py-1 text-xs font-medium text-g2a-text"
      >
        {{ tag }}
      </span>
    </div>

    <div class="rounded-lg border border-g2a-border bg-g2a-gray/60 p-4">
      <div class="flex flex-wrap items-end gap-3">
        <span
          v-if="displayOriginalPrice && !product.isFree"
          class="text-base text-g2a-muted line-through"
        >
          {{ displayOriginalPrice }}
        </span>
        <span class="text-3xl font-bold text-g2a-orange">
          {{ displayPrice }}
        </span>
        <DiscountBadge
          v-if="product.discount"
          :discount="product.discount"
        />
      </div>

      <p
        :class="cn(
          'mt-3 text-sm font-medium',
          product.inStock ? 'text-green-600' : 'text-destructive',
        )"
      >
        {{ product.comingSoon ? '尚未发售' : product.inStock ? '数字版 · 即时交付' : '暂时无货' }}
      </p>
    </div>

    <ProductDetailQuantitySelector
      v-model="quantity"
      :max="maxQuantity"
      :disabled="!product.inStock"
    />

    <div
      v-if="showTokenCheckout"
      class="rounded-lg border border-g2a-border bg-g2a-gray/60 p-4"
    >
      <p class="text-xs font-medium uppercase tracking-wide text-g2a-muted">
        支付方式
      </p>
      <p v-if="!tokenEnabled" class="mt-2 text-sm text-g2a-muted">
        代币钱包未开启，暂无法购买
      </p>
      <div v-else class="mt-3 flex flex-col gap-2">
        <button
          v-for="option in TOKEN_OPTIONS"
          :key="option.type"
          type="button"
          :class="cn(
            'flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors',
            selectedTokenType === option.type
              ? 'border-g2a-orange bg-white text-g2a-text'
              : 'border-g2a-border bg-white text-g2a-text hover:border-g2a-orange/60',
          )"
          @click="selectedTokenType = option.type"
        >
          <span class="font-medium">{{ option.label }}</span>
          <span class="text-g2a-muted">
            可用 {{ tokenBalances?.[option.type]?.available ?? 0 }}
          </span>
        </button>
        <p
          v-if="tokenEnabled && !hasSufficientToken"
          class="text-sm text-g2a-muted"
        >
          所选代币余额不足，
          <NuxtLink :to="withLocale('/wallet')" class="text-g2a-blue hover:text-g2a-orange">
            前往钱包
          </NuxtLink>
        </p>
      </div>
    </div>

    <p v-if="buyError" class="text-sm text-red-600" role="alert">
      {{ buyError }}
    </p>
    <p v-if="buySuccess" class="text-sm text-green-600">
      购买成功，正在跳转到游戏库…
    </p>

    <div class="flex flex-col gap-3 sm:flex-row">
      <Button
        size="lg"
        :disabled="!product.inStock || cartFeedback === 'added'"
        :class="cn(
          'h-11 flex-1 gap-2 bg-g2a-orange text-base font-semibold text-white transition-all duration-[var(--motion-fast)] hover:bg-g2a-orange/90 active:scale-[0.98]',
          cartFeedback === 'added' && 'bg-green-600 hover:bg-green-600',
        )"
        @click="handleAddToCart"
      >
        <ShoppingCartIcon class="size-4" />
        {{ cartFeedback === 'added' ? '已加入购物车' : '加入购物车' }}
      </Button>

      <Button
        variant="outline"
        size="lg"
        :disabled="!canBuyNow || isBuying"
        class="h-11 flex-1 gap-2 border-g2a-border text-base font-semibold text-g2a-text hover:border-g2a-orange hover:bg-white hover:text-g2a-orange active:scale-[0.98]"
        @click="handleBuyNow"
      >
        <ZapIcon class="size-4" />
        {{ isBuying ? '处理中…' : product.isFree ? '免费获取' : '立即购买' }}
      </Button>
    </div>

    <ProductDetailPlatformBadges
      :platform-windows="product.platformWindows"
      :platform-mac="product.platformMac"
      :platform-linux="product.platformLinux"
    />

    <div
      v-if="product.supportUrl || product.supportEmail"
      class="rounded-lg border border-g2a-border bg-white p-4 text-sm"
    >
      <p class="mb-2 font-medium text-g2a-text">
        客服支持
      </p>
      <p v-if="product.supportUrl">
        <a
          :href="product.supportUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-g2a-blue hover:text-g2a-orange"
        >
          {{ product.supportUrl }}
        </a>
      </p>
      <p
        v-if="product.supportEmail"
        class="mt-1"
      >
        <a
          :href="`mailto:${product.supportEmail}`"
          class="text-g2a-blue hover:text-g2a-orange"
        >
          {{ product.supportEmail }}
        </a>
      </p>
    </div>
  </div>
</template>
