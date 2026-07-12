<script setup lang="ts">
const route = useRoute()
const locale = useHomepageLocale()
const { withLocale } = useProductRoute()

const page = computed({
  get: () => Number(route.query.page) || 1,
  set: () => {},
})

const tag = computed(() => typeof route.query.tag === 'string' ? route.query.tag : undefined)
const query = computed(() => typeof route.query.q === 'string' ? route.query.q : undefined)

const { products, total, pending, error, refresh } = useGameList({
  page,
  tag,
  query,
  size: 24,
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / 24)))

function pageHref(targetPage: number) {
  const params = new URLSearchParams()
  params.set('locale', locale.value)
  params.set('page', String(targetPage))
  if (tag.value) params.set('tag', tag.value)
  if (query.value) params.set('q', query.value)
  return `/games?${params.toString()}`
}

const pageTitle = computed(() => {
  if (tag.value) return `${tag.value} 游戏`
  if (query.value) return `搜索：${query.value}`
  return '全部游戏'
})

useHead(() => ({
  title: `${pageTitle.value} | milly-project`,
}))
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-g2a-text">
        {{ pageTitle }}
      </h1>
      <p class="mt-2 text-sm text-g2a-muted">
        共 {{ total }} 款游戏
      </p>
    </div>

    <p
      v-if="error"
      class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      加载失败，请稍后重试。
      <button type="button" class="ml-2 font-medium underline" @click="refresh()">
        重试
      </button>
    </p>

    <div v-if="pending && products.length === 0" class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      <ProductProductCardSkeleton v-for="index in 12" :key="index" />
    </div>

    <div
      v-else-if="products.length > 0"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    >
      <ProductProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <div v-else class="py-20 text-center text-sm text-g2a-muted">
      暂无游戏
    </div>

    <div
      v-if="totalPages > 1"
      class="mt-10 flex items-center justify-center gap-3"
    >
      <NuxtLink
        v-if="page > 1"
        :to="pageHref(page - 1)"
        class="rounded-lg border border-g2a-border px-4 py-2 text-sm font-medium text-g2a-text hover:bg-g2a-gray"
      >
        上一页
      </NuxtLink>
      <span class="text-sm text-g2a-muted">
        第 {{ page }} / {{ totalPages }} 页
      </span>
      <NuxtLink
        v-if="page < totalPages"
        :to="pageHref(page + 1)"
        class="rounded-lg border border-g2a-border px-4 py-2 text-sm font-medium text-g2a-text hover:bg-g2a-gray"
      >
        下一页
      </NuxtLink>
    </div>
  </div>
</template>
