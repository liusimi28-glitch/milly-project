<script setup lang="ts">
import type { UnwrapRefCarouselApi } from '@/components/ui/carousel'
import type { Product } from '~/types'
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

defineProps<{
  title: string
  products: Product[]
  viewAllHref?: string
}>()

const canScrollPrev = ref(false)
const canScrollNext = ref(false)
const carouselApi = ref<UnwrapRefCarouselApi | null>(null)

function syncNavState(api: UnwrapRefCarouselApi) {
  canScrollPrev.value = api.canScrollPrev()
  canScrollNext.value = api.canScrollNext()
}

function onInitApi(api: UnwrapRefCarouselApi) {
  carouselApi.value = api
  syncNavState(api)
  api.on('select', () => syncNavState(api))
  api.on('reInit', () => syncNavState(api))
}

function scrollPrev() {
  carouselApi.value?.scrollPrev()
}

function scrollNext() {
  carouselApi.value?.scrollNext()
}
</script>

<template>
  <section class="border-b border-g2a-border bg-white py-8" :aria-label="title">
    <div class="mx-auto max-w-7xl px-4">
      <div class="mb-5 flex items-center justify-between gap-4">
        <h2 class="text-xl font-bold text-g2a-text">
          {{ title }}
        </h2>
        <div class="flex items-center gap-2">
          <NuxtLink
            v-if="viewAllHref"
            :to="viewAllHref"
            class="mr-2 hidden text-sm font-medium text-g2a-blue transition-colors duration-[var(--motion-fast)] hover:text-g2a-orange sm:inline"
          >
            View all →
          </NuxtLink>
          <Button
            variant="outline"
            size="icon-sm"
            class="rounded-full transition-opacity duration-[var(--motion-fast)]"
            :class="canScrollPrev ? 'opacity-100' : 'opacity-40'"
            :disabled="!canScrollPrev"
            aria-label="Scroll previous"
            @click="scrollPrev"
          >
            <ChevronLeftIcon class="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            class="rounded-full transition-opacity duration-[var(--motion-fast)]"
            :class="canScrollNext ? 'opacity-100' : 'opacity-40'"
            :disabled="!canScrollNext"
            aria-label="Scroll next"
            @click="scrollNext"
          >
            <ChevronRightIcon class="size-4" />
          </Button>
        </div>
      </div>

      <Carousel
        :opts="{ align: 'start', dragFree: true }"
        @init-api="onInitApi"
      >
        <CarouselContent class="-ml-3">
          <CarouselItem
            v-for="product in products"
            :key="product.id"
            class="basis-[160px] pl-3 sm:basis-[180px] md:basis-[200px]"
          >
            <ProductCard :product="product" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  </section>
</template>
