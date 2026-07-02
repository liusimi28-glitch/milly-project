<script setup lang="ts">
import type { Product } from '~/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const props = defineProps<{
  title: string
  tabs: { id: string, label: string }[]
  getProducts: (tabId: string) => Product[]
}>()

const activeTab = ref(props.tabs[0]?.id ?? '')

const currentProducts = computed(() =>
  activeTab.value ? props.getProducts(activeTab.value) : [],
)
</script>

<template>
  <section class="border-b border-g2a-border bg-white py-8" :aria-label="title">
    <div class="mx-auto max-w-7xl px-4">
      <h2 class="mb-5 text-xl font-bold text-g2a-text">
        {{ title }}
      </h2>

      <Tabs v-model="activeTab">
        <TabsList variant="line" class="w-full justify-start overflow-x-auto">
          <TabsTrigger
            v-for="tab in tabs"
            :key="tab.id"
            :value="tab.id"
            class="shrink-0 px-4 text-sm font-medium data-[state=active]:text-g2a-orange"
          >
            {{ tab.label }}
          </TabsTrigger>
        </TabsList>

        <TabsContent :value="activeTab" class="mt-6 outline-none">
          <Transition
            mode="out-in"
            enter-active-class="transition duration-[var(--motion-base)] ease-[var(--ease-out)]"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-[var(--motion-fast)] ease-[var(--ease-out)]"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              :key="activeTab"
              class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
            >
              <ProductCard
                v-for="product in currentProducts"
                :key="product.id"
                :product="product"
              />
            </div>
          </Transition>
        </TabsContent>
      </Tabs>
    </div>
  </section>
</template>
