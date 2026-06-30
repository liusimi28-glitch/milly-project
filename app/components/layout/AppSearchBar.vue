<script setup lang="ts">
import { SearchIcon } from '@lucide/vue'

const { searchSuggestions } = useMockProducts()

const query = ref('')
const isFocused = ref(false)
const searchRef = ref<HTMLElement | null>(null)

const filteredSuggestions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return searchSuggestions.slice(0, 6)
  return searchSuggestions.filter(s => s.toLowerCase().includes(q)).slice(0, 6)
})

const showDropdown = computed(() => isFocused.value && filteredSuggestions.value.length > 0)

function onBlur(event: FocusEvent) {
  const related = event.relatedTarget as Node | null
  if (related && searchRef.value?.contains(related)) return
  window.setTimeout(() => {
    isFocused.value = false
  }, 150)
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
        v-if="showDropdown"
        class="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-g2a-border bg-white py-1 shadow-lg"
        role="listbox"
      >
        <li
          v-for="suggestion in filteredSuggestions"
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
