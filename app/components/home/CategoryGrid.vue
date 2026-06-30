<script setup lang="ts">
import type { Category } from '~/types'
import { getCategoryIcon } from '@/lib/category-icons'

const { categoryQuickLinks } = useMockProducts()

function categoryHref(category: Category) {
  return `/category/${category.slug}`
}
</script>

<template>
  <section class="border-b border-g2a-border bg-white py-6" aria-label="Browse categories">
    <div class="mx-auto max-w-7xl px-4">
      <div
        class="flex gap-3 overflow-x-auto pb-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible md:grid-cols-8 [&::-webkit-scrollbar]:hidden"
        style="scroll-snap-type: x mandatory"
      >
        <NuxtLink
          v-for="category in categoryQuickLinks"
          :key="category.id"
          :to="categoryHref(category)"
          class="group flex w-[88px] shrink-0 flex-col items-center gap-2 scroll-snap-align-start sm:w-auto"
        >
          <span
            class="flex size-14 items-center justify-center rounded-full bg-g2a-gray transition-colors duration-[var(--motion-fast)] ease-[var(--ease-out)] group-hover:bg-g2a-orange/15 sm:size-16"
          >
            <component
              :is="getCategoryIcon(category.icon)"
              class="size-6 text-g2a-orange transition-transform duration-[var(--motion-fast)] group-hover:scale-110 sm:size-7"
              aria-hidden="true"
            />
          </span>
          <span
            class="line-clamp-2 text-center text-xs font-medium text-g2a-text transition-colors duration-[var(--motion-fast)] group-hover:text-g2a-orange sm:text-sm"
          >
            {{ category.name }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
