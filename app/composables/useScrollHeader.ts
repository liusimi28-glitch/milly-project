import { useWindowScroll } from '@vueuse/core'

export function useScrollHeader(threshold = 80) {
  const { y } = useWindowScroll()

  const isScrolled = computed(() => y.value > threshold)

  return { isScrolled, scrollY: y }
}
