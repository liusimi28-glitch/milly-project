<script setup lang="ts">
import { SearchIcon } from '@lucide/vue'
import { useDebounceFn } from '@vueuse/core'
import type { Product } from '~/types'

const locale = useHomepageLocale()
const { publicClient } = useApiClient()
const { productLink } = useProductRoute()
const { bestsellers } = useHomepage()

const query = ref('')
const debouncedQuery = ref('')
const isFocused = ref(false)
const searchRef = ref<HTMLElement | null>(null)
const searchResults = ref<Product[]>([])
const searchPending = ref(false)

const updateDebouncedQuery = useDebounceFn((value: string) => {
  debouncedQuery.value = value.trim()
}, 300)

watch(query, value => updateDebouncedQuery(value))

watch(debouncedQuery, async (value) => {
  if (!value) {
    searchResults.value = []
    return
  }

  searchPending.value = true
  try {
    const { fetchGameList } = await import('~/lib/api/game')
    const { mapGameListItemToProduct } = await import('~/lib/mappers/gameDetail')
    const result = await fetchGameList(publicClient.value, {
      locale: locale.value,
      query: value,
      size: 8,
    })
    searchResults.value = result.items.map(mapGameListItemToProduct)
  }
  catch {
    searchResults.value = []
  }
  finally {
    searchPending.value = false
  }
})

const fallbackSuggestions = computed(() =>
  bestsellers.value.slice(0, 6).map(product => product.title),
)

const showResults = computed(() =>
  isFocused.value && debouncedQuery.value.length > 0,
)

const showFallback = computed(() =>
  isFocused.value && !debouncedQuery.value && fallbackSuggestions.value.length > 0,
)

function onBlur(event: FocusEvent) {
  const related = event.relatedTarget as Node | null
  if (related && searchRef.value?.contains(related)) return
  window.setTimeout(() => {
    isFocused.value = false
  }, 150)
}

function goToGames(search?: string) {
  const params = new URLSearchParams({ locale: locale.value })
  if (search?.trim()) params.set('q', search.trim())
  navigateTo(`/mall?${params.toString()}`)
}
</script>

<template>
  <div ref="searchRef" class="relative w-full">
    <div class="relative">
      <SearchIcon
        class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-g2a-muted"
        aria-hidden="true"
      />
      <input
        v-model="query"
        type="search"
        placeholder="Search for games, software, gift cards…"
        class="h-10 w-full rounded-md border border-g2a-border bg-g2a-gray pr-4 pl-10 text-sm text-g2a-text transition-[border-color,box-shadow] duration-[var(--motion-fast)] outline-none placeholder:text-g2a-muted focus:border-g2a-orange focus:bg-white focus:ring-2 focus:ring-g2a-orange/25"
        autocomplete="off"
        @focus="isFocused = true"
        @blur="onBlur"
        @keydown.enter.prevent="goToGames(query)"
      >
    </div>

    <Transition
      enter-active-class="transition duration-[var(--motion-base)] ease-[var(--ease-out)]"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-[var(--motion-fast)] ease-[var(--ease-out)]"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <ul
        v-if="showResults"
        class="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-g2a-border bg-white py-1 shadow-lg"
        role="listbox"
      >
        <li v-if="searchPending" class="px-3 py-2 text-sm text-g2a-muted">
          搜索中…
        </li>
        <li
          v-for="product in searchResults"
          :key="product.id"
          role="option"
        >
          <NuxtLink
            :to="productLink(product.id)"
            class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-g2a-text transition-colors duration-[var(--motion-fast)] hover:bg-g2a-gray"
          >
            <SearchIcon class="size-3.5 shrink-0 text-g2a-muted" aria-hidden="true" />
            {{ product.title }}
          </NuxtLink>
        </li>
        <li v-if="!searchPending && searchResults.length === 0" class="px-3 py-2 text-sm text-g2a-muted">
          未找到相关游戏
        </li>
        <li>
          <button
            type="button"
            class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-g2a-blue hover:bg-g2a-gray"
            @mousedown.prevent="goToGames(query)"
          >
            查看全部搜索结果
          </button>
        </li>
      </ul>

      <ul
        v-else-if="showFallback"
        class="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-g2a-border bg-white py-1 shadow-lg"
        role="listbox"
      >
        <li
          v-for="suggestion in fallbackSuggestions"
          :key="suggestion"
          role="option"
        >
          <button
            type="button"
            class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-g2a-text transition-colors duration-[var(--motion-fast)] hover:bg-g2a-gray"
            @mousedown.prevent="query = suggestion"
          >
            <SearchIcon class="size-3.5 shrink-0 text-g2a-muted" aria-hidden="true" />
            {{ suggestion }}
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>
