<script setup lang="ts">
const { items, itemCount, subtotal, discountTotal, shippingFee, total, updateQuantity, removeItem, clear } = useCart()
const { mallLink } = useProductRoute()

function formatPrice(value: number) {
  if (value <= 0) return '免费'
  return `${value.toFixed(2)} 代币`
}

useHead({ title: '购物车 | milly-project' })
</script>

<template>
  <div>
    <MallMallNav />

    <div class="mx-auto max-w-5xl px-4 py-8">
      <div class="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-g2a-text">
            购物车
          </h1>
          <p class="mt-2 text-sm text-g2a-muted">
            <!-- TODO: replace with GET /api/v1/client/cart -->
            当前使用本地 mock 购物车，待后端接口上线后替换
          </p>
        </div>
        <button
          v-if="items.length > 0"
          type="button"
          class="text-sm font-medium text-g2a-muted hover:text-g2a-orange"
          @click="clear()"
        >
          清空购物车
        </button>
      </div>

      <div
        v-if="items.length === 0"
        class="rounded-xl border border-g2a-border bg-white p-12 text-center"
      >
        <p class="text-sm text-g2a-muted">
          购物车为空
        </p>
        <NuxtLink
          :to="mallLink()"
          class="mt-4 inline-flex rounded-lg bg-g2a-orange px-4 py-2 text-sm font-medium text-white hover:bg-g2a-orange/90"
        >
          去逛逛
        </NuxtLink>
      </div>

      <div v-else class="grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul class="space-y-4">
          <li
            v-for="item in items"
            :key="item.id"
            class="flex gap-4 rounded-xl border border-g2a-border bg-white p-4"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="size-24 rounded-lg object-cover"
            >
            <div class="min-w-0 flex-1">
              <h2 class="font-semibold text-g2a-text">
                {{ item.title }}
              </h2>
              <p class="mt-1 text-sm text-g2a-muted">
                单价 {{ formatPrice(item.unitPrice) }}
              </p>
              <div class="mt-3 flex flex-wrap items-center gap-3">
                <label class="flex items-center gap-2 text-sm text-g2a-muted">
                  数量
                  <input
                    :value="item.quantity"
                    type="number"
                    min="1"
                    max="10"
                    class="h-9 w-16 rounded-md border border-g2a-border px-2 text-g2a-text"
                    @change="updateQuantity(item.id, Number(($event.target as HTMLInputElement).value))"
                  >
                </label>
                <button
                  type="button"
                  class="text-sm text-g2a-muted hover:text-red-600"
                  @click="removeItem(item.id)"
                >
                  删除
                </button>
              </div>
            </div>
            <p class="text-base font-bold text-g2a-orange">
              {{ formatPrice(item.unitPrice * item.quantity) }}
            </p>
          </li>
        </ul>

        <aside class="h-fit rounded-xl border border-g2a-border bg-white p-6">
          <h2 class="text-lg font-semibold text-g2a-text">
            订单汇总
          </h2>
          <dl class="mt-4 space-y-3 text-sm">
            <div class="flex justify-between">
              <dt class="text-g2a-muted">
                商品总额（{{ itemCount }} 件）
              </dt>
              <dd class="font-medium text-g2a-text">
                {{ formatPrice(subtotal) }}
              </dd>
            </div>
            <div v-if="discountTotal > 0" class="flex justify-between">
              <dt class="text-g2a-muted">
                折扣
              </dt>
              <dd class="font-medium text-green-600">
                -{{ formatPrice(discountTotal) }}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-g2a-muted">
                运费
              </dt>
              <dd class="font-medium text-g2a-text">
                {{ formatPrice(shippingFee) }}
              </dd>
            </div>
            <div class="flex justify-between border-t border-g2a-border pt-3 text-base">
              <dt class="font-semibold text-g2a-text">
                应付总额
              </dt>
              <dd class="font-bold text-g2a-orange">
                {{ formatPrice(total) }}
              </dd>
            </div>
          </dl>

          <NuxtLink
            :to="mallLink('/checkout')"
            class="mt-6 flex h-11 items-center justify-center rounded-lg bg-g2a-orange text-sm font-semibold text-white hover:bg-g2a-orange/90"
          >
            去结算
          </NuxtLink>
        </aside>
      </div>
    </div>
  </div>
</template>
