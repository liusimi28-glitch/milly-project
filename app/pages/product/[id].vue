<script setup lang="ts">
const route = useRoute()

await navigateTo({
  path: `/mall/product/${route.params.id}`,
  query: route.query,
}, { redirectCode: 301 })
</script>

<template>
  <div />
</template>
