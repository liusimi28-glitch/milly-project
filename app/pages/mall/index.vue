<script setup lang="ts">
const route = useRoute()
const locale = useHomepageLocale()
const { mallLink } = useProductRoute()

const page = computed(() => Number(route.query.page) || 1)
const tag = computed(() => typeof route.query.tag === 'string' ? route.query.tag : undefined)
const query = computed(() => typeof route.query.q === 'string' ? route.query.q : undefined)

const { products, total, pending, error, refresh } = useGameList({
  page,
  tag,
  query,
  size: 24,
})

const { publicClient } = useApiClient()
const rawItems = ref<Record<string, string>>({})

watch([products, locale], async () => {
  if (products.value.length === 0) return
  try {
    const { fetchGameList } = await import('~/lib/api/game')
    const { resolveHorizontalGameImage } = await import('~/lib/game-images')
    const result = await fetchGameList(publicClient.value, {
      locale: locale.value,
      page: page.value,
      size: 24,
      query: query.value,
      tag: tag.value,
    })
    rawItems.value = Object.fromEntries(
      result.items.map(item => [String(item.id), resolveHorizontalGameImage(item)]),
    )
  }
  catch {
    rawItems.value = {}
  }
}, { immediate: true })

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / 24)))

const filterTags = ['action', 'rpg', 'indie', 'strategy', 'simulation']

function pageHref(targetPage: number) {
  return mallLink('', {
    page: String(targetPage),
    ...(tag.value ? { tag: tag.value } : {}),
    ...(query.value ? { q: query.value } : {}),
  })
}

function tagHref(value?: string) {
  const extra: Record<string, string> = {}
  if (value) extra.tag = value
  if (query.value) extra.q = query.value
  return mallLink('', extra)
}

const pageTitle = computed(() => {
  if (tag.value) return `${tag.value} 游戏`
  if (query.value) return `搜索：${query.value}`
  return '商城首页'
})

useHead(() => ({
  title: `${pageTitle.value} | milly-project`,
}))
</script>

<template>
  <div>
    <MallMallNav />

    <div class="mx-auto max-w-7xl px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-g2a-text">
          {{ pageTitle }}
        </h1>
        <p class="mt-2 text-sm text-g2a-muted">
          共 {{ total }} 款游戏
        </p>
      </div>

      <div class="mb-6 flex flex-wrap gap-2">
        <NuxtLink
          :to="tagHref()"
          class="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
          :class="!tag ? 'border-g2a-orange bg-g2a-orange text-white' : 'border-g2a-border text-g2a-text hover:bg-g2a-gray'"
        >
          全部
        </NuxtLink>
        <NuxtLink
          v-for="item in filterTags"
          :key="item"
          :to="tagHref(item)"
          class="rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition-colors"
          :class="tag === item ? 'border-g2a-orange bg-g2a-orange text-white' : 'border-g2a-border text-g2a-text hover:bg-g2a-gray'"
        >
          {{ item }}
        </NuxtLink>
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

      <div v-if="pending && products.length === 0" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProductProductCardSkeleton v-for="index in 8" :key="index" />
      </div>

      <div
        v-else-if="products.length > 0"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <MallMallGameCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :image="rawItems[product.id]"
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
  </div>
</template>
