<script setup lang="ts">
const locale = useHomepageLocale()
const { isLoggedIn } = useApiAuth()
const { entries, pending, error, refresh } = useLibrary()
const { withLocale } = useProductRoute()

useHead({ title: '我的游戏库 | milly-project' })
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8">
    <div class="mb-8 flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-g2a-text">
          我的游戏库
        </h1>
        <p class="mt-2 text-sm text-g2a-muted">
          已拥有的游戏会显示在这里
        </p>
      </div>
      <NuxtLink
        :to="withLocale('/mall')"
        class="text-sm font-medium text-g2a-blue hover:text-g2a-orange"
      >
        浏览商店 →
      </NuxtLink>
    </div>

    <div
      v-if="!isLoggedIn"
      class="rounded-xl border border-g2a-border bg-white p-8 text-center"
    >
      <p class="text-sm text-g2a-muted">
        请先登录以查看游戏库
      </p>
    </div>

    <p
      v-else-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      加载失败
      <button type="button" class="ml-2 font-medium underline" @click="refresh()">
        重试
      </button>
    </p>

    <div v-else-if="pending && entries.length === 0" class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      <ProductProductCardSkeleton v-for="index in 6" :key="index" />
    </div>

    <div
      v-else-if="entries.length > 0"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    >
      <div
        v-for="entry in entries"
        :key="entry.library.id"
        class="space-y-2"
      >
        <ProductProductCard
          v-if="entry.product"
          :product="entry.product"
        />
        <div
          v-else
          class="rounded-lg border border-g2a-border bg-g2a-gray p-4 text-sm text-g2a-muted"
        >
          游戏 #{{ entry.library.game_id }}
        </div>
        <p class="text-xs text-g2a-muted">
          游玩 {{ entry.library.play_time_minutes }} 分钟
        </p>
      </div>
    </div>

    <div v-else class="rounded-xl border border-g2a-border bg-white p-12 text-center">
      <p class="text-sm text-g2a-muted">
        库中还没有游戏
      </p>
      <NuxtLink
        :to="withLocale('/mall')"
        class="mt-4 inline-flex text-sm font-medium text-g2a-blue hover:text-g2a-orange"
      >
        去商店看看 →
      </NuxtLink>
    </div>
  </div>
</template>
