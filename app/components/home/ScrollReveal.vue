<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

const props = withDefaults(defineProps<{
  delay?: number
  /** Skip animation when already in viewport on mount (above-the-fold sections) */
  immediate?: boolean
}>(), {
  delay: 0,
  immediate: false,
})

const { prefersReducedMotion } = useReducedMotion()

const root = ref<HTMLElement | null>(null)
const isVisible = ref(false)

function checkInViewport() {
  const el = root.value
  if (!el) return false
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

useIntersectionObserver(
  root,
  ([entry]) => {
    if (entry?.isIntersecting) {
      isVisible.value = true
    }
  },
  { threshold: 0.01, rootMargin: '0px 0px 50px 0px' },
)

onMounted(() => {
  if (prefersReducedMotion.value || props.immediate) {
    isVisible.value = true
    return
  }
  if (checkInViewport()) {
    isVisible.value = true
  }
})

const revealClass = computed(() => {
  if (prefersReducedMotion.value) return ''
  return [
    'scroll-reveal transition-all motion-slow motion-ease-out',
    isVisible.value ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
  ]
})

const revealStyle = computed(() =>
  props.delay && !prefersReducedMotion.value && isVisible.value
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
