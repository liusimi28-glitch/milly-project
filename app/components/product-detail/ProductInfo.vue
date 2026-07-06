<script setup lang="ts">
import type { ProductDetail } from '~/types'
import { ShoppingCartIcon, ZapIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = defineProps<{
  product: ProductDetail
}>()

const quantity = defineModel<number>('quantity', { default: 1 })

const cartFeedback = ref<'idle' | 'added'>('idle')
const isBuying = ref(false)

const maxQuantity = computed(() => Math.min(props.product.stockCount, 10))

const tags = computed(() => [
  props.product.platform,
  props.product.region,
  ...props.product.tags.includes('random-keys') ? ['随机密钥'] : [],
])

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`
}

async function handleAddToCart() {
  if (!props.product.inStock) return

  cartFeedback.value = 'added'
  await new Promise(resolve => setTimeout(resolve, 1200))
  cartFeedback.value = 'idle'
}

async function handleBuyNow() {
  if (!props.product.inStock) return

  isBuying.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  isBuying.value = false
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div>
      <h1 class="text-2xl font-bold leading-tight text-g2a-text sm:text-3xl">
        {{ product.title }}
      </h1>

      <div class="mt-3 flex flex-wrap items-center gap-3">
        <ProductDetailStarRating
          :rating="product.averageRating"
          size="md"
        />
        <span class="text-sm text-g2a-muted">
          {{ product.reviewCount.toLocaleString() }} 条评价
        </span>
      </div>
    </div>

    <p class="text-sm leading-relaxed text-g2a-muted">
      {{ product.shortDescription }}
    </p>

    <div class="flex flex-wrap gap-2">
      <span
        v-for="tag in tags"
        :key="tag"
        class="rounded border border-g2a-border bg-g2a-gray px-2.5 py-1 text-xs font-medium text-g2a-text"
      >
        {{ tag }}
      </span>
    </div>

    <div class="rounded-lg border border-g2a-border bg-g2a-gray/60 p-4">
      <div class="flex flex-wrap items-end gap-3">
        <span
          v-if="product.originalPrice"
          class="text-base text-g2a-muted line-through"
        >
          {{ formatPrice(product.originalPrice) }}
        </span>
        <span class="text-3xl font-bold text-g2a-text">
          {{ formatPrice(product.price) }}
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
        {{ product.inStock ? `有货 · 剩余 ${product.stockCount} 件` : '暂时无货' }}
      </p>
    </div>

    <ProductDetailQuantitySelector
      v-model="quantity"
      :max="maxQuantity"
      :disabled="!product.inStock"
    />

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
        :disabled="!product.inStock || isBuying"
        class="h-11 flex-1 gap-2 border-g2a-border text-base font-semibold text-g2a-text hover:border-g2a-orange hover:bg-white hover:text-g2a-orange active:scale-[0.98]"
        @click="handleBuyNow"
      >
        <ZapIcon class="size-4" />
        {{ isBuying ? '处理中…' : '立即购买' }}
      </Button>
    </div>

    <ProductDetailPlatformBadges :platforms="[product.platform]" />
  </div>
</template>
