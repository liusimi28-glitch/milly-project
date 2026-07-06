<script setup lang="ts">
import type { ProductImage } from '~/types'
import { cn } from '@/lib/utils'

const props = defineProps<{
  images: ProductImage[]
}>()

const activeIndex = ref(0)

const activeImage = computed(() => props.images[activeIndex.value] ?? props.images[0])

function selectImage(index: number) {
  activeIndex.value = index
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="relative aspect-[4/5] overflow-hidden rounded-lg border border-g2a-border bg-g2a-gray sm:aspect-square">
      <img
        :src="activeImage?.url"
        :alt="activeImage?.alt"
        class="size-full object-cover transition-opacity duration-[var(--motion-base)]"
      >
    </div>

    <div
      class="flex gap-2 overflow-x-auto pb-1"
      role="listbox"
      aria-label="商品图片缩略图"
    >
      <button
        v-for="(image, index) in images"
        :key="image.id"
        type="button"
        role="option"
        :aria-selected="index === activeIndex"
        :class="cn(
          'relative size-16 shrink-0 overflow-hidden rounded-md border-2 transition-all duration-[var(--motion-fast)] hover:border-g2a-orange/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-g2a-orange focus-visible:ring-offset-2',
          index === activeIndex ? 'border-g2a-orange' : 'border-g2a-border',
        )"
        @click="selectImage(index)"
      >
        <img
          :src="image.url"
          :alt="image.alt"
          class="size-full object-cover"
        >
      </button>
    </div>
  </div>
</template>
