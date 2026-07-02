<script setup lang="ts">
import { Dice5Icon } from '@lucide/vue'

const { randomKeys } = useMockProducts()
</script>

<template>
  <section class="border-b border-g2a-border bg-g2a-gray py-8" aria-label="Random keys">
    <div class="mx-auto max-w-7xl px-4">
      <div class="mb-5 flex items-center gap-3">
        <span class="flex size-10 items-center justify-center rounded-full bg-g2a-orange/15">
          <Dice5Icon class="size-5 text-g2a-orange" aria-hidden="true" />
        </span>
        <div>
          <h2 class="text-xl font-bold text-g2a-text">
            Random Keys
          </h2>
          <p class="text-sm text-g2a-muted">
            Premium mystery titles from $1.99 — try your luck
          </p>
        </div>
        <NuxtLink
          to="/best-deals/random-keys"
          class="ml-auto hidden text-sm font-medium text-g2a-blue transition-colors duration-[var(--motion-fast)] hover:text-g2a-orange sm:inline"
        >
          View all →
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <ProductCard
          v-for="product in randomKeys"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </section>
</template>
