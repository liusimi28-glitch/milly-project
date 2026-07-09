export function useCountdown() {
  const remaining = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null

  const active = computed(() => remaining.value > 0)

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    remaining.value = 0
  }

  function start(seconds: number) {
    if (timer) clearInterval(timer)
    remaining.value = Math.max(0, Math.floor(seconds))
    if (!remaining.value) return

    timer = setInterval(() => {
      if (remaining.value <= 1) {
        stop()
        return
      }
      remaining.value -= 1
    }, 1000)
  }

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  return {
    remaining,
    active,
    start,
    stop,
  }
}
