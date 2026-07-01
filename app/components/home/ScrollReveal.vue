<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

const props = withDefaults(defineProps<{
  delay?: number
}>(), {
  delay: 0,
})

const { prefersReducedMotion } = useReducedMotion()

const root = ref<HTMLElement | null>(null)
const isVisible = ref(false)

useIntersectionObserver(
  root,
  ([entry]) => {
    if (entry?.isIntersecting) {
      isVisible.value = true
    }
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
)

const revealClass = computed(() => {
  if (prefersReducedMotion.value) return ''
  return [
    'scroll-reveal transition-all motion-slow motion-ease-out',
    isVisible.value ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
  ]
})

const revealStyle = computed(() =>
  props.delay && !prefersReducedMotion.value
    ? { transitionDelay: `${props.delay}ms` }
    : undefined,
)
</script>

<template>
  <div
    ref="root"
    :class="revealClass"
    :style="revealStyle"
  >
    <slot />
  </div>
</template>
