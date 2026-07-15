<script setup lang="ts">
const { isLoggedIn } = useApiAuth()
const { profile, pending, error, refresh, saveProfile } = useProfile()
const { avatarUrl: oauthAvatarUrl } = useSupabaseAuth()
const { withLocale } = useProductRoute()

const nickname = ref('')
const avatar = ref('')
const savePending = ref(false)
const saveMessage = ref('')
const previewBroken = ref(false)

watch(profile, (value) => {
  nickname.value = value?.player_profile?.nickname ?? ''
  avatar.value = value?.player_profile?.avatar_url ?? ''
}, { immediate: true })

watch(avatar, () => {
  previewBroken.value = false
})

const previewUrl = computed(() => {
  const trimmed = avatar.value.trim()
  return trimmed || undefined
})

const canUseGoogleAvatar = computed(() => {
  const oauth = oauthAvatarUrl.value?.trim()
  if (!oauth) return false
  return oauth !== avatar.value.trim()
})

function useGoogleAvatar() {
  const oauth = oauthAvatarUrl.value?.trim()
  if (!oauth) return
  avatar.value = oauth
  previewBroken.value = false
}

function onPreviewError() {
  previewBroken.value = true
}

async function handleSave() {
  saveMessage.value = ''
  savePending.value = true
  try {
    await saveProfile({
      nickname: nickname.value.trim(),
      avatar: avatar.value.trim() || undefined,
    })
    saveMessage.value = '资料已保存'
  }
  catch (err) {
    saveMessage.value = err instanceof Error ? err.message : '保存失败'
  }
  finally {
    savePending.value = false
  }
}

useHead({ title: '个人资料 | milly-project' })
</script>

<template>
  <div class="mx-auto max-w-lg px-4 py-8">
    <h1 class="text-3xl font-bold text-g2a-text">
      个人资料
    </h1>

    <div
      v-if="!isLoggedIn"
      class="mt-8 rounded-xl border border-g2a-border bg-white p-8 text-center text-sm text-g2a-muted"
    >
      请先登录
    </div>

    <template v-else>
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

      <form
        v-else
        class="mt-8 space-y-4 rounded-xl border border-g2a-border bg-white p-6"
        @submit.prevent="handleSave"
      >
        <p v-if="pending" class="text-sm text-g2a-muted">
          加载中…
        </p>

        <label class="block text-sm text-g2a-muted">
          邮箱
          <input
            :value="profile?.email ?? ''"
            type="email"
            disabled
            class="mt-1 h-10 w-full rounded-md border border-g2a-border bg-g2a-gray px-3 text-g2a-text"
          >
        </label>

        <label class="block text-sm text-g2a-muted">
          昵称
          <input
            v-model="nickname"
            type="text"
            required
            class="mt-1 h-10 w-full rounded-md border border-g2a-border px-3 text-g2a-text"
          >
        </label>

        <div class="space-y-2">
          <label class="block text-sm text-g2a-muted">
            头像 URL
            <input
              v-model="avatar"
              type="url"
              class="mt-1 h-10 w-full rounded-md border border-g2a-border px-3 text-g2a-text"
            >
          </label>

          <div class="flex flex-wrap items-center gap-3">
            <div
              class="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-g2a-dark text-sm font-bold text-white"
              aria-hidden="true"
            >
              <img
                v-if="previewUrl && !previewBroken"
                :src="previewUrl"
                alt=""
                referrerpolicy="no-referrer"
                class="size-full object-cover"
                @error="onPreviewError"
              >
              <span v-else>{{ (nickname.trim() || '?').charAt(0).toUpperCase() }}</span>
            </div>

            <button
              v-if="canUseGoogleAvatar"
              type="button"
              class="text-sm font-medium text-g2a-blue hover:text-g2a-orange"
              @click="useGoogleAvatar"
            >
              使用 Google 头像
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="h-10 rounded-lg bg-g2a-orange px-4 text-sm font-medium text-white disabled:opacity-60"
          :disabled="savePending || pending"
        >
          {{ savePending ? '保存中…' : '保存资料' }}
        </button>

        <p v-if="saveMessage" class="text-sm text-g2a-muted">
          {{ saveMessage }}
        </p>
      </form>

      <div class="mt-6 flex flex-wrap gap-4 text-sm">
        <NuxtLink :to="withLocale('/library')" class="text-g2a-blue hover:text-g2a-orange">
          我的游戏库
        </NuxtLink>
        <NuxtLink :to="withLocale('/orders')" class="text-g2a-blue hover:text-g2a-orange">
          我的订单
        </NuxtLink>
        <NuxtLink :to="withLocale('/wallet')" class="text-g2a-blue hover:text-g2a-orange">
          我的钱包
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
