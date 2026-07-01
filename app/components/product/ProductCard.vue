<script setup lang="ts">
import type { Product } from '~/types'
import { StarIcon } from '@lucide/vue'

const props = defineProps<{
  product: Product
}>()

const { prefersReducedMotion } = useReducedMotion()

const imageRef = ref<HTMLImageElement | null>(null)
const imageLoaded = ref(false)

function markImageLoaded() {
  imageLoaded.value = true
}

function syncImageLoadedState() {
  const img = imageRef.value
  if (img?.complete && img.naturalWidth > 0) {
    markImageLoaded()
  }
}

function onImageError() {
  markImageLoaded()
}

watch(() => props.product.image, () => {
  imageLoaded.value = false
  nextTick(syncImageLoadedState)
})

onMounted(syncImageLoadedState)

const badgeLabel: Record<string, string> = {
  bestseller: 'Bestseller',
  new: 'New',
  plus: 'Plus',
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`
}

const productHref = computed(() => `/product/${props.product.id}`)

const cardClass = computed(() => [
  'group flex h-full flex-col overflow-hidden rounded-lg border border-g2a-border bg-white transition-all duration-[var(--motion-base)] ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:ring-g2a-orange focus-visible:ring-offset-2 focus-visible:outline-none',
  prefersReducedMotion.value ? 'hover:shadow-md' : 'hover:-translate-y-0.5 hover:shadow-lg',
])

const imageClass = computed(() => [
  'size-full object-cover transition-all duration-[var(--motion-base)] ease-[var(--ease-out)]',
  !prefersReducedMotion.value && 'group-hover:scale-[1.03]',
  imageLoaded.value ? 'opacity-100' : 'opacity-0',
])
</script>

<template>
  <NuxtLink
    :to="productHref"
    :class="cardClass"
  >
    <div class="relative aspect-[3/4] overflow-hidden bg-g2a-gray">
      <div
        v-if="!imageLoaded"
        class="absolute inset-0 animate-pulse bg-g2a-gray"
        aria-hidden="true"
      />
      <img
        ref="imageRef"
        :src="product.image"
        :alt="product.title"
        loading="lazy"
        decoding="async"
        :class="imageClass"
        @load="markImageLoaded"
        @error="onImageError"
      >

      <div class="absolute top-2 left-2 flex flex-col gap-1">
        <DiscountBadge
          v-if="product.discount"
          :discount="product.discount"
        />
      </div>

      <span
        v-if="product.badge"
        class="absolute top-2 right-2 rounded bg-g2a-dark/80 px-1.5 py-0.5 text-[10px] font-semibold text-white uppercase"
      >
        {{ badgeLabel[product.badge] ?? product.badge }}
      </span>
    </div>

    <div class="flex flex-1 flex-col p-3">
      <h3 class="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-g2a-text transition-colors duration-[var(--motion-fast)] group-hover:text-g2a-orange">
        {{ product.title }}
      </h3>

      <p class="mt-1 text-xs text-g2a-muted">
        {{ product.platform }} · {{ product.region }}
      </p>

      <div class="mt-auto pt-2">
        <div class="flex items-baseline gap-2">
          <span class="text-base font-bold text-g2a-text">
            {{ formatPrice(product.price) }}
          </span>
          <span
            v-if="product.originalPrice"
            class="text-xs text-g2a-muted line-through"
          >
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>

        <div class="mt-1 flex items-center gap-1 text-xs text-g2a-muted">
          <StarIcon class="size-3 fill-g2a-orange text-g2a-orange" aria-hidden="true" />
          <span>{{ product.sellerRating.toFixed(1) }}</span>
          <span class="truncate">· {{ product.seller }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
