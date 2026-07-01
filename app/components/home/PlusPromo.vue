<script setup lang="ts">
import { CrownIcon, SparklesIcon } from '@lucide/vue'

const { prefersReducedMotion } = useReducedMotion()
</script>

<template>
  <section class="border-b border-g2a-border py-8" aria-label="G2A Plus promotion">
    <div class="mx-auto max-w-7xl px-4">
      <div
        class="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#4a00e0] via-[#0066CC] to-[#1a1a2e] px-6 py-10 sm:px-10 sm:py-12"
      >
        <div
          class="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-white/10 blur-2xl"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -bottom-8 -left-8 size-32 rounded-full bg-g2a-orange/20 blur-xl"
          aria-hidden="true"
        />

        <div class="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div class="max-w-xl">
            <div class="mb-2 flex items-center gap-2 text-white/90">
              <CrownIcon class="size-5 text-g2a-orange" aria-hidden="true" />
              <span class="text-sm font-semibold tracking-wide uppercase">G2A Plus</span>
            </div>
            <h2 class="text-2xl font-bold text-white sm:text-3xl">
              Save more with exclusive deals
            </h2>
            <p class="mt-2 text-sm text-white/80 sm:text-base">
              Members get unique discounts, priority support, and special offers on thousands of games.
            </p>
          </div>

          <NuxtLink
            to="/plus"
            class="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-g2a-orange px-6 text-sm font-semibold text-white transition-all duration-[var(--motion-fast)] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none"
            :class="!prefersReducedMotion && 'hover:brightness-110'"
          >
            <SparklesIcon class="size-4" aria-hidden="true" />
            Join G2A Plus
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
