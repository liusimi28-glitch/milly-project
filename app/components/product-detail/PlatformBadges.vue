<script setup lang="ts">
const props = defineProps<{
  platformWindows: boolean
  platformMac: boolean
  platformLinux: boolean
}>()

const platformItems = computed(() => [
  { key: 'windows', label: 'Windows', enabled: props.platformWindows },
  { key: 'mac', label: 'macOS', enabled: props.platformMac },
  { key: 'linux', label: 'Linux', enabled: props.platformLinux },
].filter(item => item.enabled))
</script>

<template>
  <div
    v-if="platformItems.length > 0"
    class="flex flex-wrap items-center gap-2"
  >
    <span class="text-xs font-medium uppercase tracking-wide text-g2a-muted">
      支持平台
    </span>
    <span
      v-for="platform in platformItems"
      :key="platform.key"
      class="inline-flex items-center rounded border border-g2a-border bg-g2a-gray px-2.5 py-1 text-xs font-semibold text-g2a-text"
    >
      {{ platform.label }}
    </span>
  </div>
</template>
