<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuth } from '@/composables/useAuth'

  const router = useRouter()
  const { user, fetchUser, logout } = useAuth()
  const loading = ref(true)

  onMounted(async () => {
    const currentUser = await fetchUser()
    loading.value = false

    if (!currentUser) {
      await router.replace('/login')
    }
  })

  async function handleLogout () {
    logout()
    await router.push('/login')
  }
</script>

<template>
  <div class="max-w-lg mx-auto w-full">
    <div
      v-if="loading"
      class="text-center py-12 text-on-surface opacity-60"
    >
      加载中…
    </div>

    <div
      v-else-if="user"
      class="rounded-xl border border-subtle bg-surface p-8 text-center"
    >
      <img
        v-if="user.avatar_url"
        :alt="user.login"
        class="w-20 h-20 rounded-full mx-auto mb-4"
        :src="user.avatar_url"
      >
      <h1 class="text-2xl font-bold text-on-surface mb-2">
        欢迎，{{ user.name || user.login }}
      </h1>
      <p class="text-sm text-on-surface opacity-60 mb-6">
        你已通过 GitHub 登录
      </p>
      <button
        class="px-6 py-2 rounded-lg border border-subtle text-on-surface hover:bg-surface-variant transition-colors"
        type="button"
        @click="handleLogout"
      >
        登出
      </button>
    </div>
  </div>
</template>
