import { usePreferredReducedMotion } from '@vueuse/core'

export function useReducedMotion() {
  const preferred = usePreferredReducedMotion()

  const prefersReducedMotion = computed(
    () => preferred.value === 'reduce',
  )

  return { prefersReducedMotion }
}
