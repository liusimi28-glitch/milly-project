<script setup lang="ts">
import type { Product } from '~/types'

defineProps<{
  title: string
  products: Product[]
  viewAllHref?: string
}>()
</script>

<template>
  <section class="border-b border-g2a-border bg-white py-8" :aria-label="title">
    <div class="mx-auto max-w-7xl px-4">
      <div class="mb-5 flex items-center justify-between">
        <h2 class="text-xl font-bold text-g2a-text">
          {{ title }}
        </h2>
        <NuxtLink
          v-if="viewAllHref"
          :to="viewAllHref"
          class="text-sm font-medium text-g2a-blue transition-colors duration-[var(--motion-fast)] hover:text-g2a-orange"
        >
          View all →
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </section>
</template>
