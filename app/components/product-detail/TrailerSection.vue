<script setup lang="ts">
import type { ProductTrailer } from '~/types'

defineProps<{
  trailers: ProductTrailer[]
}>()

function isDirectVideo(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url)
}
</script>

<template>
  <section
    v-if="trailers.length > 0"
    class="space-y-4"
    aria-label="游戏预告片"
  >
    <h2 class="text-lg font-bold text-g2a-text">
      预告片
    </h2>

    <div
      v-for="trailer in trailers"
      :key="trailer.id"
      class="overflow-hidden rounded-lg border border-g2a-border bg-g2a-dark"
    >
      <div class="border-b border-g2a-border bg-white px-4 py-3">
        <h3 class="text-sm font-semibold text-g2a-text">
          {{ trailer.title }}
        </h3>
      </div>

      <div class="aspect-video bg-black">
        <video
          v-if="isDirectVideo(trailer.url)"
          :src="trailer.url"
          :poster="trailer.thumbnailUrl"
          controls
          playsinline
          class="size-full object-contain"
        />
        <iframe
          v-else
          :src="trailer.url"
          :title="trailer.title"
          class="size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </div>
    </div>
  </section>
</template>
