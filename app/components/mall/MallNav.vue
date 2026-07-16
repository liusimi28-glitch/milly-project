<script setup lang="ts">
const route = useRoute()
const { mallLink } = useProductRoute()

const navItems = [
  { label: '商城首页', path: '' },
  { label: '购物车', path: '/cart' },
  { label: '库存/余额', path: '/inventory' },
  { label: '充值', path: '/recharge' },
  { label: '在线玩', path: '/play' },
]

function isActive(path: string) {
  const target = path ? `/mall${path}` : '/mall'
  if (path === '') {
    return route.path === '/mall' || route.path === '/mall/'
  }
  return route.path.startsWith(target)
}
</script>

<template>
  <nav
    class="border-b border-g2a-border bg-white"
    aria-label="商城导航"
  >
    <div class="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="mallLink(item.path)"
        class="shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-[var(--motion-fast)]"
        :class="isActive(item.path)
          ? 'bg-g2a-orange text-white'
          : 'text-g2a-text hover:bg-g2a-gray hover:text-g2a-orange'"
      >
        {{ item.label }}
      </NuxtLink>
    </div>
  </nav>
</template>
