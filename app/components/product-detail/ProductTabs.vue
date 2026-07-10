<script setup lang="ts">
import type { ProductDetail } from '~/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const props = defineProps<{
  product: ProductDetail
}>()

const activeTab = ref('details')

const tabItems = computed(() => {
  const items = [
    { value: 'details', label: '商品详情' },
    { value: 'specs', label: '规格参数' },
  ] as const

  if (props.product.reviews.length > 0) {
    return [...items, { value: 'reviews' as const, label: '用户评价' }]
  }

  return items
})

const hasHtmlDescription = computed(() => Boolean(props.product.descriptionHtml?.trim()))
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
            <div
              v-if="hasHtmlDescription"
              class="prose prose-sm max-w-none text-g2a-muted prose-headings:text-g2a-text prose-a:text-g2a-blue"
              v-html="product.descriptionHtml"
            />
            <p
              v-else
              class="text-sm leading-7 text-g2a-muted"
            >
              {{ product.description }}
            </p>
          </div>

          <div v-if="product.features.length > 0">
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
        <dl
          v-if="product.specs.length > 0"
          class="grid gap-3 sm:grid-cols-2"
        >
          <div
            v-for="spec in product.specs"
            :key="spec.label"
            class="flex flex-col rounded-lg border border-g2a-border bg-g2a-gray/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <dt class="text-sm font-medium text-g2a-muted">
              {{ spec.label }}
            </dt>
            <dd class="text-sm font-semibold text-g2a-text">
              <a
                v-if="spec.label === '客服链接'"
                :href="spec.value"
                target="_blank"
                rel="noopener noreferrer"
                class="text-g2a-blue hover:underline"
              >
                {{ spec.value }}
              </a>
              <a
                v-else-if="spec.label === '客服邮箱'"
                :href="`mailto:${spec.value}`"
                class="text-g2a-blue hover:underline"
              >
                {{ spec.value }}
              </a>
              <span v-else>{{ spec.value }}</span>
            </dd>
          </div>
        </dl>
        <p
          v-else
          class="text-sm text-g2a-muted"
        >
          暂无规格信息
        </p>
      </TabsContent>

      <TabsContent
        v-if="product.reviews.length > 0"
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
              </div>
              <time class="text-xs text-g2a-muted">{{ review.date }}</time>
            </div>
            <p class="text-sm leading-relaxed text-g2a-muted">
              {{ review.content }}
            </p>
          </li>
        </ul>
      </TabsContent>
    </Tabs>
  </section>
</template>
