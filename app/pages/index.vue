<script setup lang="ts">
const {
  weeklyTrends,
  bestsellers,
  products,
} = useMockProducts()

const pendingSections = [
  { id: 'weekly-trends', label: 'Weekly Trends', count: weeklyTrends.length },
  { id: 'bestsellers', label: 'Bestsellers', count: bestsellers.length },
  { id: 'genres', label: 'Genre Tabs', count: 5 },
  { id: 'budget', label: 'Budget Deals', count: 2 },
  { id: 'plus', label: 'G2A Plus Promo', count: 1 },
  { id: 'random-keys', label: 'Random Keys', count: 1 },
  { id: 'trust', label: 'Trust Badges', count: 4 },
  { id: 'app', label: 'App Download', count: 1 },
] as const
</script>

<template>
  <div>
    <HomeHeroBanner />
    <HomeCategoryGrid />

    <section
      v-for="section in pendingSections"
      :key="section.id"
      class="border-b border-g2a-border bg-white py-6"
    >
      <div class="mx-auto max-w-7xl px-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-g2a-text">
            {{ section.label }}
          </h2>
          <span class="rounded bg-g2a-gray px-2 py-0.5 text-xs text-g2a-muted">
            {{ section.count }} items · 待实现
          </span>
        </div>
        <div
          class="mt-4 flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-g2a-border text-sm text-g2a-muted"
        >
          {{ section.label }} 组件占位
        </div>
      </div>
    </section>
  </div>
</template>
