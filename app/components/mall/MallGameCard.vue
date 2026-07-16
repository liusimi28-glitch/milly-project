<script setup lang="ts">
import type { Product } from '~/types'
import { StarIcon } from '@lucide/vue'

const props = defineProps<{
  product: Product
  image?: string
}>()

const { productLink } = useProductRoute()
const { prefersReducedMotion } = useReducedMotion()

const coverImage = computed(() => props.image || props.product.image)

function formatPrice(value: number) {
  if (value <= 0) return '免费'
  return `${value} 代币`
}
</script>

<template>
  <NuxtLink
    :to="productLink(product.id)"
    class="group flex h-full flex-col overflow-hidden rounded-lg border border-g2a-border bg-white transition-all duration-[var(--motion-base)] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-g2a-orange focus-visible:ring-offset-2 focus-visible:outline-none"
    :class="!prefersReducedMotion && 'hover:-translate-y-0.5'"
  >
    <div class="relative aspect-[462/174] overflow-hidden bg-g2a-gray">
      <img
        :src="coverImage"
        :alt="product.title"
        loading="lazy"
        decoding="async"
        class="size-full object-cover transition-transform duration-[var(--motion-base)] group-hover:scale-[1.02]"
      >
      <DiscountBadge
        v-if="product.discount"
        class="absolute top-2 left-2"
        :discount="product.discount"
      />
    </div>

    <div class="flex flex-1 flex-col p-4">
      <h3 class="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-g2a-text group-hover:text-g2a-orange">
        {{ product.title }}
      </h3>

      <div class="mt-auto flex items-end justify-between gap-2 pt-3">
        <div class="flex items-baseline gap-2">
          <span class="text-base font-bold text-g2a-orange">
            {{ formatPrice(product.price) }}
          </span>
          <span
            v-if="product.originalPrice"
            class="text-xs text-g2a-muted line-through"
          >
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>
        <div class="flex items-center gap-1 text-xs text-g2a-muted">
          <StarIcon class="size-3 fill-g2a-orange text-g2a-orange" />
          {{ product.sellerRating.toFixed(1) }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
