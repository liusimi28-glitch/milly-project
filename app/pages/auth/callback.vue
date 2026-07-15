<script setup lang="ts">
import {
  formatOAuthErrorMessage,
  parseOAuthCallbackError,
  sanitizeAuthRedirectPath,
} from '~/lib/auth-redirect'

const route = useRoute()
const router = useRouter()
const { authLoading, isLoggedIn } = useSupabaseAuth()

const oauthError = computed(() =>
  parseOAuthCallbackError(
    route.query as Record<string, unknown>,
    import.meta.client ? window.location.hash : '',
  ),
)

const errorMessage = computed(() =>
  oauthError.value ? formatOAuthErrorMessage(oauthError.value) : null,
)

const redirectTarget = computed(() =>
  sanitizeAuthRedirectPath(
    typeof route.query.redirect === 'string' ? route.query.redirect : '/',
  ),
)

useSeoMeta({ title: '正在完成登录…' })

watch(
  [authLoading, oauthError, isLoggedIn],
  ([loading, err]) => {
    if (err) return
    if (loading) return
    router.replace(redirectTarget.value)
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
    <template v-if="errorMessage">
      <h1 class="text-xl font-semibold text-g2a-text">
        登录失败
      </h1>
      <p class="max-w-md text-sm text-g2a-muted" role="alert">
        {{ errorMessage }}
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <NuxtLink
          to="/"
          class="text-sm font-medium text-g2a-blue hover:text-g2a-orange"
        >
          返回首页
        </NuxtLink>
        <button
          type="button"
          class="text-sm font-medium text-g2a-orange hover:underline"
          @click="router.replace(redirectTarget)"
        >
          返回上一页重试
        </button>
      </div>
    </template>
    <p
      v-else
      class="text-sm text-g2a-muted"
    >
      正在完成登录…
    </p>
  </div>
</template>
