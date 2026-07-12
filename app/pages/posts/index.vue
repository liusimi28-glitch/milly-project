<script setup lang="ts">
const { posts, pending, error, refresh } = usePosts()
const locale = useHomepageLocale()

useHead({ title: '社区帖子 | milly-project' })
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <h1 class="text-3xl font-bold text-g2a-text">
      社区
    </h1>
    <p class="mt-2 text-sm text-g2a-muted">
      浏览已发布的帖子
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

    <ul v-else-if="posts.length > 0" class="mt-8 space-y-4">
      <li
        v-for="post in posts"
        :key="post.id"
        class="rounded-xl border border-g2a-border bg-white p-5"
      >
        <NuxtLink
          :to="`/posts/${post.id}?locale=${encodeURIComponent(locale)}`"
          class="text-lg font-semibold text-g2a-text hover:text-g2a-orange"
        >
          {{ post.title }}
        </NuxtLink>
        <p v-if="post.postType" class="mt-2 text-xs uppercase tracking-wide text-g2a-muted">
          {{ post.postType }}
        </p>
        <p v-if="post.createdAt" class="mt-2 text-xs text-g2a-muted">
          {{ post.createdAt }}
        </p>
      </li>
    </ul>

    <div v-else class="mt-8 rounded-xl border border-g2a-border bg-white p-12 text-center text-sm text-g2a-muted">
      暂无帖子
    </div>
  </div>
</template>
