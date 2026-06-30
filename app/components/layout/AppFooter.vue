<script setup lang="ts">
const { footerColumns, paymentMethods } = useMockProducts()

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-g2a-border bg-g2a-dark text-white">
    <div class="mx-auto max-w-7xl px-4 py-10">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="column in footerColumns"
          :key="column.title"
        >
          <h3 class="mb-4 text-sm font-semibold text-white">
            {{ column.title }}
          </h3>
          <ul class="space-y-2">
            <li v-for="link in column.links" :key="link.href">
              <NuxtLink
                :to="link.href"
                class="text-sm text-white/70 transition-colors duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:text-g2a-orange"
                :target="link.href.startsWith('http') ? '_blank' : undefined"
                :rel="link.href.startsWith('http') ? 'noopener noreferrer' : undefined"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 border-t border-white/10 pt-8">
        <p class="mb-3 text-xs font-semibold tracking-wide text-white/50 uppercase">
          Payment methods
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="method in paymentMethods"
            :key="method"
            class="rounded border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/80 transition-colors duration-[var(--motion-fast)] hover:border-g2a-orange/50 hover:text-white"
          >
            {{ method }}
          </span>
        </div>
      </div>

      <div class="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
        <p class="text-sm text-white/50">
          © {{ currentYear }} G2A.COM Marketplace (demo clone). All rights reserved.
        </p>
        <p class="text-xs text-white/40">
          Mock data only · Not affiliated with G2A.COM
        </p>
      </div>
    </div>
  </footer>
</template>
