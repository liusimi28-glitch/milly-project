<script setup lang="ts">
const route = useRoute()
const { getProductDetail, getRecommended } = useProductDetail()

const productId = computed(() => route.params.id as string)

const product = computed(() => getProductDetail(productId.value))
const recommended = computed(() => getRecommended(productId.value, 6))

const quantity = ref(1)

useHead(() => ({
  title: product.value ? `${product.value.title} | milly-project` : '商品未找到',
}))

watch(productId, () => {
  quantity.value = 1
})
</script>

<template>
  <div v-if="product">
    <div class="border-b border-g2a-border bg-white py-6">
      <div class="mx-auto max-w-7xl px-4">
        <ProductDetailProductBreadcrumb :items="product.breadcrumb" />

        <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductDetailProductGallery :images="product.images" />
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

    <ProductDetailRecommendedProducts :products="recommended" />
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
</template>
