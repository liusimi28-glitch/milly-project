<script setup lang="ts">
defineProps<{
  discount: number
}>()
</script>

<template>
  <span
    class="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-bold text-white bg-g2a-orange"
  >
    -{{ discount }}%
  </span>
</template>
