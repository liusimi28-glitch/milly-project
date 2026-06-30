<script setup lang="ts">
const { topBarLinks } = useMockProducts()
</script>

<template>
  <div class="bg-g2a-dark text-white">
    <div class="mx-auto max-w-7xl overflow-x-auto px-4">
      <nav
        class="flex h-9 min-w-max items-center gap-1 md:justify-center md:gap-0"
        aria-label="Quick links"
      >
        <NuxtLink
          v-for="(link, index) in topBarLinks"
          :key="link.href"
          :to="link.href"
          class="whitespace-nowrap px-3 text-xs transition-colors duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:text-g2a-orange"
          :class="[
            link.highlight ? 'font-semibold text-g2a-orange hover:text-white' : 'text-white/80',
            index < topBarLinks.length - 1 ? 'md:border-r md:border-white/15' : '',
          ]"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>
