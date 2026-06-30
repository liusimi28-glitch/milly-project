<script setup lang="ts">
import type { Category } from '~/types'
import {
  BitcoinIcon,
  CoinsIcon,
  Dice5Icon,
  FileTextIcon,
  Gamepad2Icon,
  GiftIcon,
  GraduationCapIcon,
  GhostIcon,
  LayoutGridIcon,
  MonitorIcon,
  PackageIcon,
  RepeatIcon,
  ShieldCheckIcon,
  ShieldIcon,
  SmartphoneIcon,
  SparklesIcon,
  SwordsIcon,
  TrophyIcon,
} from '@lucide/vue'
import type { Component } from 'vue'

defineEmits<{
  keepOpen: []
  close: []
}>()

defineProps<{
  open: boolean
}>()

const { categories } = useMockProducts()

const iconMap: Record<string, Component> = {
  'gamepad-2': Gamepad2Icon,
  'monitor': MonitorIcon,
  'gift': GiftIcon,
  'package': PackageIcon,
  'repeat': RepeatIcon,
  'dice-5': Dice5Icon,
  'coins': CoinsIcon,
  'smartphone': SmartphoneIcon,
  'graduation-cap': GraduationCapIcon,
  'bitcoin': BitcoinIcon,
  'swords': SwordsIcon,
  'shield': ShieldIcon,
  'ghost': GhostIcon,
  'sparkles': SparklesIcon,
  'trophy': TrophyIcon,
  'file-text': FileTextIcon,
  'shield-check': ShieldCheckIcon,
  'layout-grid': LayoutGridIcon,
  'steam': Gamepad2Icon,
  'xbox': Gamepad2Icon,
  'playstation': Gamepad2Icon,
}

function getIcon(name: string) {
  return iconMap[name] ?? PackageIcon
}

function categoryHref(category: Category) {
  return `/category/${category.slug}`
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-[var(--motion-base)] ease-[var(--ease-out)]"
    enter-from-class="opacity-0 -translate-y-1"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-[var(--motion-fast)] ease-[var(--ease-out)]"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-1"
  >
    <div
      v-if="open"
      class="absolute inset-x-0 top-full z-40 border-b border-g2a-border bg-white shadow-lg"
      @mouseenter="$emit('keepOpen')"
      @mouseleave="$emit('close')"
    >
      <div class="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-6 px-4 py-6 md:grid-cols-3 lg:grid-cols-5">
        <div
          v-for="category in categories"
          :key="category.id"
        >
          <NuxtLink
            :to="categoryHref(category)"
            class="group flex items-center gap-2 font-semibold text-g2a-text transition-colors duration-[var(--motion-fast)] hover:text-g2a-orange"
          >
            <component
              :is="getIcon(category.icon)"
              class="size-4 text-g2a-orange"
              aria-hidden="true"
            />
            {{ category.name }}
          </NuxtLink>
          <ul v-if="category.children?.length" class="mt-2 space-y-1">
            <li v-for="child in category.children" :key="child.id">
              <NuxtLink
                :to="categoryHref(child)"
                class="block py-0.5 text-sm text-g2a-muted transition-colors duration-[var(--motion-fast)] hover:text-g2a-orange"
              >
                {{ child.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Transition>
</template>
