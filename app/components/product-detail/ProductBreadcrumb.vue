<script setup lang="ts">
import type { BreadcrumbItem } from '~/types'
import { ChevronRightIcon } from '@lucide/vue'

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav
    aria-label="面包屑导航"
    class="mb-6 text-sm text-g2a-muted"
  >
    <ol class="flex flex-wrap items-center gap-1">
      <li
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        class="flex items-center gap-1"
      >
        <ChevronRightIcon
          v-if="index > 0"
          class="size-3.5 shrink-0 text-g2a-border"
          aria-hidden="true"
        />
        <NuxtLink
          v-if="item.href"
          :to="item.href"
          class="transition-colors duration-[var(--motion-fast)] hover:text-g2a-orange"
        >
          {{ item.label }}
        </NuxtLink>
        <span
          v-else
          class="line-clamp-1 font-medium text-g2a-text"
          aria-current="page"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
