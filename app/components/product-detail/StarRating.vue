<script setup lang="ts">
import { StarIcon } from '@lucide/vue'

const props = withDefaults(defineProps<{
  rating: number
  max?: number
  showValue?: boolean
  size?: 'sm' | 'md'
}>(), {
  max: 5,
  showValue: true,
  size: 'md',
})

const starSize = computed(() => (props.size === 'sm' ? 'size-3.5' : 'size-4'))

const fullStars = computed(() => Math.floor(props.rating))
const hasHalf = computed(() => props.rating % 1 >= 0.5)
</script>

<template>
  <div class="flex items-center gap-1.5">
    <div
      class="flex items-center"
      :aria-label="`评分 ${rating.toFixed(1)} / ${max}`"
      role="img"
    >
      <StarIcon
        v-for="i in max"
        :key="i"
        :class="[
          starSize,
          i <= fullStars || (i === fullStars + 1 && hasHalf)
            ? 'fill-g2a-orange text-g2a-orange'
            : 'fill-g2a-border text-g2a-border',
        ]"
        aria-hidden="true"
      />
    </div>
    <span
      v-if="showValue"
      class="text-sm font-semibold text-g2a-text"
    >
      {{ rating.toFixed(1) }}
    </span>
  </div>
</template>
