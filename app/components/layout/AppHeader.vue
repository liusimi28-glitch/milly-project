<script setup lang="ts">
import {
  ChevronDownIcon,
  GlobeIcon,
  MenuIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from '@lucide/vue'
import type { Category } from '~/types'

const { categories } = useMockProducts()
const { isScrolled } = useScrollHeader(80)

const megaMenuOpen = ref(false)
const mobileMenuOpen = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null

function openMegaMenu() {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  megaMenuOpen.value = true
}

function scheduleCloseMegaMenu() {
  closeTimer = setTimeout(() => {
    megaMenuOpen.value = false
    closeTimer = null
  }, 150)
}

function keepMegaMenuOpen() {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function categoryHref(category: Category) {
  return `/category/${category.slug}`
}

watch(mobileMenuOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
  if (closeTimer) clearTimeout(closeTimer)
})
</script>

<template>
  <header
    class="sticky top-0 z-50 bg-white transition-shadow duration-[var(--motion-base)] ease-[var(--ease-out)]"
    :class="isScrolled ? 'shadow-md' : 'shadow-none'"
  >
    <div class="relative border-b border-g2a-border">
      <div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:gap-4">
        <!-- Mobile menu button -->
        <button
          type="button"
          class="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-g2a-text transition-colors duration-[var(--motion-fast)] hover:bg-g2a-gray lg:hidden"
          :aria-expanded="mobileMenuOpen"
          aria-label="Toggle menu"
          @click="toggleMobileMenu"
        >
          <MenuIcon v-if="!mobileMenuOpen" class="size-5" />
          <XIcon v-else class="size-5" />
        </button>

        <!-- Logo -->
        <NuxtLink
          to="/"
          class="shrink-0 text-2xl font-bold tracking-tight text-g2a-orange transition-opacity duration-[var(--motion-fast)] hover:opacity-90"
        >
          G2A
        </NuxtLink>

        <!-- Categories trigger (desktop) -->
        <div
          class="relative hidden shrink-0 lg:block"
          @mouseenter="openMegaMenu"
          @mouseleave="scheduleCloseMegaMenu"
        >
          <button
            type="button"
            class="flex h-10 items-center gap-1 rounded-md px-3 text-sm font-medium text-g2a-text transition-colors duration-[var(--motion-fast)] hover:bg-g2a-gray hover:text-g2a-orange"
            :class="megaMenuOpen ? 'bg-g2a-gray text-g2a-orange' : ''"
            :aria-expanded="megaMenuOpen"
          >
            Categories
            <ChevronDownIcon
              class="size-4 transition-transform duration-[var(--motion-fast)]"
              :class="megaMenuOpen ? 'rotate-180' : ''"
            />
          </button>
          <LayoutAppMegaMenu
            :open="megaMenuOpen"
            @keep-open="keepMegaMenuOpen"
            @close="scheduleCloseMegaMenu"
          />
        </div>

        <!-- Search -->
        <div class="min-w-0 flex-1">
          <LayoutAppSearchBar />
        </div>

        <!-- Actions -->
        <div class="flex shrink-0 items-center gap-1 sm:gap-2">
          <NuxtLink
            to="/account"
            class="inline-flex size-10 items-center justify-center rounded-md text-g2a-text transition-all duration-[var(--motion-fast)] hover:bg-g2a-gray hover:text-g2a-orange"
            aria-label="Account"
          >
            <UserIcon class="size-5" />
          </NuxtLink>

          <NuxtLink
            to="/cart"
            class="relative inline-flex size-10 items-center justify-center rounded-md text-g2a-text transition-all duration-[var(--motion-fast)] hover:scale-105 hover:bg-g2a-gray hover:text-g2a-orange"
            aria-label="Cart, 3 items"
          >
            <ShoppingCartIcon class="size-5" />
            <span
              class="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-g2a-orange text-[10px] font-bold text-white"
            >
              3
            </span>
          </NuxtLink>

          <button
            type="button"
            class="hidden items-center gap-1 rounded-md px-2 py-1.5 text-sm text-g2a-text transition-colors duration-[var(--motion-fast)] hover:bg-g2a-gray sm:inline-flex"
            aria-label="Language and region"
          >
            <GlobeIcon class="size-4" />
            <span class="hidden md:inline">EN / USD</span>
          </button>
        </div>
      </div>

      <!-- Mobile search row (optional compact - search already in main row) -->
    </div>

    <!-- Mobile drawer -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-[var(--motion-base)] ease-[var(--ease-out)] lg:hidden"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-[var(--motion-fast)] ease-[var(--ease-out)] lg:hidden"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="mobileMenuOpen"
          class="fixed inset-0 z-[60] bg-black/40 lg:hidden"
          aria-hidden="true"
          @click="closeMobileMenu"
        />
      </Transition>

      <Transition
        enter-active-class="transition duration-[var(--motion-base)] ease-[var(--ease-out)] lg:hidden"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition duration-[var(--motion-fast)] ease-[var(--ease-out)] lg:hidden"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <aside
          v-if="mobileMenuOpen"
          class="fixed inset-y-0 left-0 z-[70] flex w-[min(320px,85vw)] flex-col bg-white shadow-xl lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div class="flex h-16 items-center justify-between border-b border-g2a-border px-4">
            <span class="text-xl font-bold text-g2a-orange">G2A</span>
            <button
              type="button"
              class="inline-flex size-10 items-center justify-center rounded-md hover:bg-g2a-gray"
              aria-label="Close menu"
              @click="closeMobileMenu"
            >
              <XIcon class="size-5" />
            </button>
          </div>

          <nav class="flex-1 overflow-y-auto p-4">
            <p class="mb-2 text-xs font-semibold tracking-wide text-g2a-muted uppercase">
              Categories
            </p>
            <ul class="space-y-1">
              <li v-for="category in categories" :key="category.id">
                <NuxtLink
                  :to="categoryHref(category)"
                  class="block rounded-md px-3 py-2 text-sm font-medium text-g2a-text transition-colors duration-[var(--motion-fast)] hover:bg-g2a-gray hover:text-g2a-orange"
                  @click="closeMobileMenu"
                >
                  {{ category.name }}
                </NuxtLink>
                <ul v-if="category.children?.length" class="mb-2 ml-3 border-l border-g2a-border pl-3">
                  <li v-for="child in category.children" :key="child.id">
                    <NuxtLink
                      :to="categoryHref(child)"
                      class="block py-1.5 text-sm text-g2a-muted transition-colors duration-[var(--motion-fast)] hover:text-g2a-orange"
                      @click="closeMobileMenu"
                    >
                      {{ child.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </aside>
      </Transition>
    </Teleport>
  </header>
</template>
