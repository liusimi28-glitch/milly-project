<script setup lang="ts">
const route = useRoute()
const locale = useHomepageLocale()
const { post, pending, error, refresh } = usePostDetail(() => route.params.id as string)

useHead(() => ({
  title: post.value?.title ? `${post.value.title} | 社区` : '帖子详情',
}))
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <NuxtLink
      :to="`/posts?locale=${encodeURIComponent(locale)}`"
      class="text-sm text-g2a-blue hover:text-g2a-orange"
    >
      ← 返回社区
    </NuxtLink>

    <div v-if="pending && !post" class="mt-8 text-sm text-g2a-muted">
      加载中…
    </div>

    <p
      v-else-if="error"
      class="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      加载失败
      <button type="button" class="ml-2 font-medium underline" @click="refresh()">
        重试
      </button>
    </p>

    <article v-else-if="post" class="mt-8 rounded-xl border border-g2a-border bg-white p-6">
      <h1 class="text-3xl font-bold text-g2a-text">
        {{ post.title }}
      </h1>
      <p v-if="post.accessType" class="mt-2 text-xs uppercase tracking-wide text-g2a-muted">
        {{ post.accessType }}
      </p>
      <div
        v-if="post.content"
        class="prose prose-sm mt-6 max-w-none text-g2a-text"
        v-html="post.content"
      />
      <p v-else class="mt-6 text-sm text-g2a-muted">
        暂无正文内容
      </p>
    </article>

    <div v-else class="mt-8 text-center text-sm text-g2a-muted">
      帖子不存在
    </div>
  </div>
</template>
