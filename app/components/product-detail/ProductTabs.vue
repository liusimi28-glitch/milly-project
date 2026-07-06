<script setup lang="ts">
import type { ProductDetail } from '~/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StarIcon } from '@lucide/vue'

defineProps<{
  product: ProductDetail
}>()

const activeTab = ref('details')

const tabItems = [
  { value: 'details', label: '商品详情' },
  { value: 'specs', label: '规格参数' },
  { value: 'reviews', label: '用户评价' },
  { value: 'seller', label: '卖家信息' },
] as const
</script>

<template>
  <section class="rounded-lg border border-g2a-border bg-white">
    <Tabs
      v-model="activeTab"
      class="w-full"
    >
      <div class="border-b border-g2a-border px-4 pt-4 sm:px-6">
        <TabsList
          variant="line"
          class="h-auto w-full justify-start gap-0 overflow-x-auto rounded-none bg-transparent p-0"
        >
          <TabsTrigger
            v-for="tab in tabItems"
            :key="tab.value"
            :value="tab.value"
            class="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-g2a-muted data-active:border-g2a-orange data-active:bg-transparent data-active:text-g2a-orange data-active:shadow-none after:hidden"
          >
            {{ tab.label }}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="details"
        class="px-4 py-6 sm:px-6"
      >
        <div class="max-w-3xl space-y-6">
          <div>
            <h3 class="mb-3 text-lg font-bold text-g2a-text">
              商品描述
            </h3>
            <p class="text-sm leading-7 text-g2a-muted">
              {{ product.description }}
            </p>
          </div>

          <div>
            <h3 class="mb-3 text-lg font-bold text-g2a-text">
              功能特点
            </h3>
            <ul class="space-y-2">
              <li
                v-for="feature in product.features"
                :key="feature"
                class="flex items-start gap-2 text-sm text-g2a-muted"
              >
                <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-g2a-orange" />
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="specs"
        class="px-4 py-6 sm:px-6"
      >
        <dl class="grid gap-3 sm:grid-cols-2">
          <div
            v-for="spec in product.specs"
            :key="spec.label"
            class="flex flex-col rounded-lg border border-g2a-border bg-g2a-gray/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <dt class="text-sm font-medium text-g2a-muted">
              {{ spec.label }}
            </dt>
            <dd class="text-sm font-semibold text-g2a-text">
              {{ spec.value }}
            </dd>
          </div>
        </dl>
      </TabsContent>

      <TabsContent
        value="reviews"
        class="px-4 py-6 sm:px-6"
      >
        <div class="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-g2a-border bg-g2a-gray/50 p-4">
          <div class="text-center">
            <div class="text-4xl font-bold text-g2a-text">
              {{ product.averageRating.toFixed(1) }}
            </div>
            <ProductDetailStarRating
              :rating="product.averageRating"
              :show-value="false"
              size="sm"
              class="mt-1 justify-center"
            />
          </div>
          <p class="text-sm text-g2a-muted">
            基于 {{ product.reviewCount.toLocaleString() }} 条用户评价
          </p>
        </div>

        <ul class="space-y-4">
          <li
            v-for="review in product.reviews"
            :key="review.id"
            class="rounded-lg border border-g2a-border p-4"
          >
            <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-g2a-text">{{ review.author }}</span>
                <span
                  v-if="review.verified"
                  class="rounded bg-g2a-gray px-1.5 py-0.5 text-[10px] font-medium text-g2a-muted"
                >
                  已验证购买
                </span>
              </div>
              <time class="text-xs text-g2a-muted">{{ review.date }}</time>
            </div>
            <div class="mb-2 flex items-center gap-0.5">
              <StarIcon
                v-for="i in 5"
                :key="i"
                class="size-3.5"
                :class="i <= review.rating ? 'fill-g2a-orange text-g2a-orange' : 'fill-g2a-border text-g2a-border'"
                aria-hidden="true"
              />
            </div>
            <p class="text-sm leading-relaxed text-g2a-muted">
              {{ review.content }}
            </p>
          </li>
        </ul>
      </TabsContent>

      <TabsContent
        value="seller"
        class="px-4 py-6 sm:px-6"
      >
        <div class="max-w-xl rounded-lg border border-g2a-border bg-g2a-gray/50 p-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 class="text-xl font-bold text-g2a-text">
                {{ product.sellerDetail.name }}
              </h3>
              <p class="mt-1 text-sm text-g2a-muted">
                {{ product.sellerDetail.level }}
              </p>
            </div>
            <ProductDetailStarRating
              :rating="product.sellerDetail.rating"
              size="sm"
            />
          </div>

          <dl class="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-g2a-muted">
                历史销量
              </dt>
              <dd class="mt-1 text-lg font-bold text-g2a-text">
                {{ product.sellerDetail.totalSales.toLocaleString() }}
              </dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-g2a-muted">
                好评率
              </dt>
              <dd class="mt-1 text-lg font-bold text-g2a-text">
                {{ product.sellerDetail.positiveRate }}%
              </dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-g2a-muted">
                入驻时间
              </dt>
              <dd class="mt-1 text-lg font-bold text-g2a-text">
                {{ product.sellerDetail.memberSince }}
              </dd>
            </div>
          </dl>
        </div>
      </TabsContent>
    </Tabs>
  </section>
</template>
