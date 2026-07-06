<script setup lang="ts">
import type { Product } from '~/types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

defineProps<{
  products: Product[]
}>()
</script>

<template>
  <section
    class="border-t border-g2a-border bg-white py-8"
    aria-label="推荐商品"
  >
    <div class="mx-auto max-w-7xl px-4">
      <h2 class="mb-5 text-xl font-bold text-g2a-text">
        你可能也喜欢
      </h2>

      <Carousel
        class="w-full"
        :opts="{ align: 'start', dragFree: true }"
      >
        <CarouselContent class="-ml-3">
          <CarouselItem
            v-for="product in products"
            :key="product.id"
            class="basis-[70%] pl-3 sm:basis-[45%] md:basis-[32%] lg:basis-[24%]"
          >
            <ProductProductCard :product="product" />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious class="hidden border-g2a-border bg-white text-g2a-text hover:bg-g2a-gray sm:flex" />
        <CarouselNext class="hidden border-g2a-border bg-white text-g2a-text hover:bg-g2a-gray sm:flex" />
      </Carousel>
    </div>
  </section>
</template>
