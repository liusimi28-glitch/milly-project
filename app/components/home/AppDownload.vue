<script setup lang="ts">
import { SmartphoneIcon } from '@lucide/vue'

const { prefersReducedMotion } = useReducedMotion()

const storeButtonClass = computed(() => [
  'inline-flex h-12 min-w-[140px] items-center justify-center rounded-lg border border-g2a-border bg-g2a-dark px-5 text-sm font-semibold text-white shadow-sm transition-all duration-[var(--motion-fast)] focus-visible:ring-2 focus-visible:ring-g2a-orange focus-visible:ring-offset-2 focus-visible:outline-none',
  prefersReducedMotion.value ? 'hover:bg-g2a-dark/90' : 'hover:scale-105 hover:shadow-md',
])
</script>

<template>
  <section class="border-b border-g2a-border bg-g2a-gray py-10" aria-label="Download mobile app">
    <div class="mx-auto max-w-7xl px-4">
      <div class="flex flex-col items-center gap-8 rounded-xl border border-g2a-border bg-white p-6 sm:flex-row sm:justify-between sm:p-8">
        <div class="flex max-w-lg flex-col items-center text-center sm:flex-row sm:items-start sm:gap-5 sm:text-left">
          <span class="mb-4 flex size-14 shrink-0 items-center justify-center rounded-2xl bg-g2a-orange/10 sm:mb-0">
            <SmartphoneIcon class="size-7 text-g2a-orange" aria-hidden="true" />
          </span>
          <div>
            <h2 class="text-xl font-bold text-g2a-text">
              Get the G2A app
            </h2>
            <p class="mt-2 text-sm text-g2a-muted">
              Browse deals, track orders, and buy on the go. Available on iOS and Android.
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#"
            :class="storeButtonClass"
            aria-label="Download on the App Store"
            @click.prevent
          >
            App Store
          </a>
          <a
            href="#"
            :class="storeButtonClass"
            aria-label="Get it on Google Play"
            @click.prevent
          >
            Google Play
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
