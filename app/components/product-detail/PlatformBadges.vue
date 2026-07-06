<script setup lang="ts">
import type { Platform } from '~/types'

defineProps<{
  platforms: Platform[]
}>()

const platformLabels: Record<Platform, string> = {
  Steam: 'Steam',
  Xbox: 'Xbox',
  PlayStation: 'PS',
  Origin: 'Origin',
  Uplay: 'Ubisoft',
  GOG: 'GOG',
  Epic: 'Epic',
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="text-xs font-medium uppercase tracking-wide text-g2a-muted">
      支持平台
    </span>
    <span
      v-for="platform in platforms"
      :key="platform"
      class="inline-flex items-center rounded border border-g2a-border bg-g2a-gray px-2.5 py-1 text-xs font-semibold text-g2a-text"
    >
      {{ platformLabels[platform] ?? platform }}
    </span>
  </div>
</template>
