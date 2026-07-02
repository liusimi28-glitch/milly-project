<script setup lang="ts">
import {
  BadgeCheckIcon,
  BotIcon,
  CreditCardIcon,
  ShieldCheckIcon,
} from '@lucide/vue'

const badges = [
  {
    id: 'secure',
    icon: ShieldCheckIcon,
    title: 'Secure checkout',
    description: 'Protected by industry-standard encryption on every purchase.',
  },
  {
    id: 'antifraud',
    icon: BotIcon,
    title: 'AI fraud prevention',
    description: 'Advanced AI helps block fraudulent transactions before they happen.',
  },
  {
    id: 'verified',
    icon: BadgeCheckIcon,
    title: 'Verified sellers',
    description: 'Buy from trusted sellers with ratings and buyer protection.',
  },
  {
    id: 'payments',
    icon: CreditCardIcon,
    title: '400+ payment methods',
    description: 'PayPal, cards, Skrill, crypto, and regional options worldwide.',
  },
]
</script>

<template>
  <section class="border-b border-g2a-border bg-white py-10" aria-label="Trust and security">
    <div class="mx-auto max-w-7xl px-4">
      <h2 class="mb-6 text-center text-xl font-bold text-g2a-text sm:text-left">
        Shop with confidence
      </h2>

      <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="badge in badges"
          :key="badge.id"
          class="group flex gap-4 rounded-lg border border-g2a-border bg-g2a-gray/50 p-4 transition-colors duration-[var(--motion-fast)] hover:border-g2a-orange/30 hover:bg-white"
        >
          <span
            class="flex size-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-colors duration-[var(--motion-fast)] group-hover:bg-g2a-orange/10"
          >
            <component
              :is="badge.icon"
              class="size-5 text-g2a-muted transition-colors duration-[var(--motion-fast)] group-hover:text-g2a-orange"
              aria-hidden="true"
            />
          </span>
          <div class="min-w-0">
            <h3 class="text-sm font-semibold text-g2a-text">
              {{ badge.title }}
            </h3>
            <p class="mt-1 text-xs leading-relaxed text-g2a-muted">
              {{ badge.description }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
