<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuth } from '@/composables/useAuth'

  const router = useRouter()
  const { isAuthenticated, user, fetchUser, logout } = useAuth()

  onMounted(() => {
    if (isAuthenticated.value) {
      fetchUser()
    }
  })

  async function handleLogout () {
    logout()
    await router.push('/login')
  }
</script>

<template>
  <header class="flex items-center justify-between mb-8 max-w-2xl mx-auto w-full">
    <router-link
      class="text-lg font-semibold text-on-background"
      to="/"
    >
      milly-project
    </router-link>

    <div class="flex items-center gap-3">
      <template v-if="isAuthenticated && user">
        <img
          :alt="user.login"
          class="w-8 h-8 rounded-full"
          :src="user.avatar_url"
        >
        <router-link
          class="text-sm text-primary hover:underline"
          to="/dashboard"
        >
          {{ user.login }}
        </router-link>
        <button
          class="text-sm text-on-surface opacity-60 hover:opacity-100"
          type="button"
          @click="handleLogout"
        >
          登出
        </button>
      </template>
      <router-link
        v-else
        class="text-sm text-primary hover:underline"
        to="/login"
      >
        登录
      </router-link>
    </div>
  </header>
</template>
