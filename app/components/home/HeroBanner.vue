<script setup lang="ts">
import type { UnwrapRefCarouselApi } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

const { banners } = useMockProducts()
const { prefersReducedMotion } = useReducedMotion()

const selectedIndex = ref(0)
const carouselApi = ref<UnwrapRefCarouselApi | null>(null)

const autoplay = Autoplay({ delay: 5000, stopOnMouseEnter: true })

const plugins = computed(() =>
  prefersReducedMotion.value ? undefined : [autoplay],
)

function syncNavState(api: UnwrapRefCarouselApi) {
  selectedIndex.value = api.selectedScrollSnap()
}

function onInitApi(api: UnwrapRefCarouselApi) {
  carouselApi.value = api
  syncNavState(api)
  api.on('select', () => syncNavState(api))
}

function scrollTo(index: number) {
  carouselApi.value?.scrollTo(index)
}

function scrollPrev() {
  carouselApi.value?.scrollPrev()
}

function scrollNext() {
  carouselApi.value?.scrollNext()
}
</script>

<template>
  <section class="relative bg-g2a-gray" aria-label="Promotional banners">
    <Carousel
      class="w-full"
      :opts="{ loop: true }"
      :plugins="plugins"
      @init-api="onInitApi"
    >
      <CarouselContent class="-ml-0">
        <CarouselItem
          v-for="banner in banners"
          :key="banner.id"
          class="pl-0"
        >
          <div
            class="relative flex min-h-[220px] items-center overflow-hidden sm:min-h-[280px] md:min-h-[320px]"
            :style="{ backgroundColor: banner.bgColor ?? '#FF6B00' }"
          >
            <img
              :src="banner.image"
              :alt="banner.title"
              class="absolute inset-0 size-full object-cover opacity-40"
              loading="lazy"
            >
            <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

            <div class="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-12">
              <h2 class="max-w-xl text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                {{ banner.title }}
              </h2>
              <p
                v-if="banner.subtitle"
                class="mt-2 max-w-lg text-sm text-white/85 sm:text-base"
              >
                {{ banner.subtitle }}
              </p>
              <NuxtLink
                :to="banner.href"
                class="mt-5 inline-flex h-10 items-center rounded-md bg-g2a-orange px-5 text-sm font-semibold text-white transition-all duration-[var(--motion-fast)] hover:brightness-110"
              >
                {{ banner.cta }}
              </NuxtLink>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>

      <!-- Arrows -->
      <Button
        variant="outline"
        size="icon"
        class="absolute top-1/2 left-3 z-10 size-9 -translate-y-1/2 rounded-full border-white/30 bg-white/90 shadow transition-opacity duration-[var(--motion-fast)] hover:bg-white sm:left-4 sm:size-10"
        aria-label="Previous slide"
        @click="scrollPrev"
      >
        <ChevronLeftIcon class="size-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="absolute top-1/2 right-3 z-10 size-9 -translate-y-1/2 rounded-full border-white/30 bg-white/90 shadow transition-opacity duration-[var(--motion-fast)] hover:bg-white sm:right-4 sm:size-10"
        aria-label="Next slide"
        @click="scrollNext"
      >
        <ChevronRightIcon class="size-5" />
      </Button>

      <!-- Dot indicators -->
      <div
        class="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2"
        role="tablist"
        aria-label="Banner slides"
      >
        <button
          v-for="(banner, index) in banners"
          :key="banner.id"
          type="button"
          role="tab"
          :aria-selected="selectedIndex === index"
          :aria-label="`Go to slide ${index + 1}: ${banner.title}`"
          class="h-2 rounded-full bg-white/50 transition-all duration-[var(--motion-base)] ease-[var(--ease-out)] hover:bg-white/80"
          :class="selectedIndex === index ? 'w-6 bg-white' : 'w-2'"
          @click="scrollTo(index)"
        />
      </div>
    </Carousel>
  </section>
</template>
