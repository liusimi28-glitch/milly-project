<script setup lang="ts">
import type { ProductDetail } from '~/types'

defineProps<{
  product: ProductDetail
}>()
</script>

<template>
  <section class="relative overflow-hidden border-b border-g2a-border bg-g2a-dark">
    <div
      v-if="product.backgroundImage"
      class="absolute inset-0"
      aria-hidden="true"
    >
      <img
        :src="product.backgroundImage"
        alt=""
        class="size-full scale-110 object-cover opacity-40 blur-2xl"
      >
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-g2a-dark" />
    </div>

    <div class="relative mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div class="overflow-hidden rounded-lg border border-white/10 shadow-lg">
        <div class="aspect-[920/430] bg-g2a-gray">
          <img
            :src="product.headerImage"
            :alt="product.title"
            class="size-full object-cover"
          >
        </div>
      </div>
    </div>
  </section>
</template>
