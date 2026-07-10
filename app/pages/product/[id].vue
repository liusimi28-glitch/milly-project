<script setup lang="ts">
const route = useRoute()
const { product, recommended, pending, error, refresh } = useGameDetail(() => route.params.id as string)

const quantity = ref(1)

const errorMessage = computed(() => {
  if (!error.value) return ''
  if (error.value instanceof Error) return error.value.message
  return '加载失败，请稍后重试'
})

useHead(() => ({
  title: product.value ? `${product.value.title} | milly-project` : '商品未找到',
}))

watch(() => route.params.id, () => {
  quantity.value = 1
})
</script>

<template>
  <div>
    <ProductDetailProductDetailSkeleton v-if="pending && !product" />

    <div
      v-else-if="error"
      class="mx-auto max-w-7xl px-4 py-20 text-center"
      role="alert"
    >
      <h1 class="text-2xl font-bold text-g2a-text">
        加载失败
      </h1>
      <p class="mt-2 text-sm text-g2a-muted">
        {{ errorMessage }}
      </p>
      <button
        type="button"
        class="mt-6 inline-flex text-sm font-medium text-g2a-blue transition-colors duration-[var(--motion-fast)] hover:text-g2a-orange"
        @click="refresh()"
      >
        重试
      </button>
    </div>

    <div v-else-if="product">
      <ProductDetailProductHero :product="product" />

      <div class="border-b border-g2a-border bg-white py-6">
        <div class="mx-auto max-w-7xl px-4">
          <ProductDetailProductBreadcrumb :items="product.breadcrumb" />

          <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div class="space-y-8">
              <ProductDetailTrailerSection :trailers="product.trailers" />
              <ProductDetailProductGallery :images="product.images" />
            </div>

            <ProductDetailProductInfo
              v-model:quantity="quantity"
              :product="product"
            />
          </div>
        </div>
      </div>

      <div class="bg-g2a-gray py-8">
        <div class="mx-auto max-w-7xl px-4">
          <ProductDetailProductTabs :product="product" />
        </div>
      </div>

      <ProductDetailRecommendedProducts
        v-if="recommended && recommended.length > 0"
        :products="recommended"
      />
    </div>

    <div
      v-else
      class="mx-auto max-w-7xl px-4 py-20 text-center"
    >
      <h1 class="text-2xl font-bold text-g2a-text">
        商品未找到
      </h1>
      <p class="mt-2 text-sm text-g2a-muted">
        该商品可能已下架或链接无效。
      </p>
      <NuxtLink
        to="/"
        class="mt-6 inline-flex text-sm font-medium text-g2a-blue transition-colors duration-[var(--motion-fast)] hover:text-g2a-orange"
      >
        返回首页 →
      </NuxtLink>
    </div>
  </div>
</template>
