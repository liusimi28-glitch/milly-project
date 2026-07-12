<script setup lang="ts">
const { promotions, pending, error, refresh } = usePromotions()
const locale = useHomepageLocale()

const statusLabel: Record<string, string> = {
  upcoming: '即将开始',
  active: '进行中',
  ended: '已结束',
}

useHead({ title: '促销活动 | milly-project' })
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <h1 class="text-3xl font-bold text-g2a-text">
      促销活动
    </h1>
    <p class="mt-2 text-sm text-g2a-muted">
      当前及近期活动
    </p>

    <p
      v-if="error"
      class="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      加载失败
      <button type="button" class="ml-2 font-medium underline" @click="refresh()">
        重试
      </button>
    </p>

    <div v-else-if="pending" class="mt-8 text-sm text-g2a-muted">
      加载中…
    </div>

    <ul v-else-if="promotions.length > 0" class="mt-8 space-y-4">
      <li
        v-for="promotion in promotions"
        :key="promotion.id"
        class="rounded-xl border border-g2a-border bg-white p-5"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-g2a-text">
              {{ promotion.title }}
            </h2>
            <p v-if="promotion.description" class="mt-2 text-sm text-g2a-muted">
              {{ promotion.description }}
            </p>
          </div>
          <span class="shrink-0 rounded bg-g2a-gray px-2 py-1 text-xs font-medium text-g2a-text">
            {{ statusLabel[promotion.status] ?? promotion.status }}
          </span>
        </div>
        <p v-if="promotion.start_time && promotion.end_time" class="mt-3 text-xs text-g2a-muted">
          {{ promotion.start_time }} — {{ promotion.end_time }}
        </p>
        <NuxtLink
          :to="`/games?locale=${encodeURIComponent(locale)}`"
          class="mt-4 inline-flex text-sm text-g2a-blue hover:text-g2a-orange"
        >
          浏览参与游戏 →
        </NuxtLink>
      </li>
    </ul>

    <div v-else class="mt-8 rounded-xl border border-g2a-border bg-white p-12 text-center text-sm text-g2a-muted">
      暂无促销活动
    </div>
  </div>
</template>
