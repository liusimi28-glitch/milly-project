<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAuth } from '@/composables/useAuth'

  const route = useRoute()
  const { loginWithGitHub } = useAuth()

  const errorMessages: Record<string, string> = {
    invalid_state: '登录状态无效，请重试',
    no_token: '未能获取 GitHub 授权，请重试',
    auth_failed: 'GitHub 登录失败，请稍后重试',
  }

  const errorMessage = computed(() => {
    const error = route.query.error
    if (typeof error !== 'string') return null
    return errorMessages[error] ?? '登录失败，请重试'
  })
</script>

<template>
  <div class="max-w-md mx-auto w-full">
    <div class="rounded-xl border border-subtle bg-surface p-8">
      <h1 class="text-2xl font-bold text-on-surface mb-2">
        登录
      </h1>
      <p class="text-sm text-on-surface opacity-60 mb-6">
        使用 GitHub 账号登录 milly-project
      </p>

      <p
        v-if="errorMessage"
        class="text-sm text-error mb-4"
        role="alert"
      >
        {{ errorMessage }}
      </p>

      <button
        class="w-full px-4 py-3 rounded-lg bg-[#24292f] text-white font-medium hover:opacity-90 transition-opacity"
        type="button"
        @click="loginWithGitHub"
      >
        使用 GitHub 账号登录
      </button>
    </div>
  </div>
</template>
