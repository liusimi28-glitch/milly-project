<script setup lang="ts">
type TurnstileRenderOptions = {
  sitekey: string
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
}

type TurnstileApi = {
  render: (container: Element, options: TurnstileRenderOptions) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const modelValue = defineModel<string | null>({ default: null })
const props = withDefaults(defineProps<{
  enabled: boolean
  siteKey?: string
}>(), {
  siteKey: '',
})

const containerRef = ref<HTMLElement | null>(null)
const ready = ref(false)
const widgetId = ref<string | null>(null)
const scriptUrl = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

function ensureScript() {
  if (!import.meta.client) return Promise.resolve()
  if (window.turnstile) return Promise.resolve()

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load Turnstile script')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = scriptUrl
    script.async = true
    script.defer = true
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => reject(new Error('Failed to load Turnstile script')), { once: true })
    document.head.appendChild(script)
  })
}

function renderWidget() {
  if (!import.meta.client || !props.enabled || !props.siteKey || !containerRef.value || !window.turnstile) return
  if (widgetId.value) return

  widgetId.value = window.turnstile.render(containerRef.value, {
    sitekey: props.siteKey,
    callback: (token) => {
      modelValue.value = token
    },
    'expired-callback': () => {
      modelValue.value = null
    },
    'error-callback': () => {
      modelValue.value = null
    },
  })
  ready.value = true
}

function reset() {
  if (!props.enabled) return
  modelValue.value = null
  if (import.meta.client && window.turnstile && widgetId.value) {
    window.turnstile.reset(widgetId.value)
  }
}

function removeWidget() {
  ready.value = false
  modelValue.value = null
  if (import.meta.client && window.turnstile && widgetId.value) {
    window.turnstile.remove(widgetId.value)
  }
  widgetId.value = null
}

watch(() => [props.enabled, props.siteKey] as const, async ([enabled, siteKey]) => {
  removeWidget()
  if (!enabled || !siteKey || !import.meta.client) return
  try {
    await ensureScript()
    renderWidget()
  } catch {
    ready.value = false
  }
}, { immediate: true })

onBeforeUnmount(() => {
  removeWidget()
})

defineExpose({
  reset,
})
</script>

<template>
  <div v-if="enabled" class="space-y-1">
    <div ref="containerRef" class="min-h-16" />
    <p v-if="!ready" class="text-[11px] text-g2a-muted">
      Loading verification...
    </p>
  </div>
</template>
