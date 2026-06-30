<script setup lang="ts">
const {
  banners,
  categoryQuickLinks,
  weeklyTrends,
  bestsellers,
  products,
} = useMockProducts()

const sections = [
  { id: 'hero', label: 'Hero Banner', count: banners.length },
  { id: 'categories', label: 'Category Grid', count: categoryQuickLinks.length },
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
    <!-- 阶段 0 骨架：展示各区块占位，验证 mock 数据已接入 -->
    <section class="border-b border-g2a-border bg-white py-8">
      <div class="mx-auto max-w-7xl px-4">
        <h1 class="text-2xl font-bold text-g2a-text">
          G2A 首页仿制
        </h1>
        <p class="mt-2 text-g2a-muted">
          阶段 0 骨架 · 共 {{ products.length }} 条假数据已就绪
        </p>
      </div>
    </section>

    <section
      v-for="section in sections"
      :key="section.id"
      class="border-b border-g2a-border py-6"
      :class="section.id === 'hero' ? 'bg-g2a-orange/10' : 'bg-white'"
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

    <!-- 主题色验证条 -->
    <section class="bg-g2a-dark py-6">
      <div class="mx-auto flex max-w-7xl flex-wrap gap-4 px-4">
        <div class="rounded px-4 py-2 text-sm font-medium text-white bg-g2a-orange">
          G2A Orange
        </div>
        <div class="rounded px-4 py-2 text-sm font-medium text-white bg-g2a-blue">
          G2A Blue
        </div>
        <div class="rounded border border-g2a-border px-4 py-2 text-sm text-g2a-text bg-white">
          Background
        </div>
        <div class="rounded px-4 py-2 text-sm text-g2a-muted bg-g2a-gray">
          Muted Text
        </div>
      </div>
    </section>
  </div>
</template>
