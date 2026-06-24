<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuth } from '@/composables/useAuth'

  const route = useRoute()
  const router = useRouter()
  const { setToken, fetchUser } = useAuth()

  onMounted(async () => {
    const tokenFromUrl = route.query.token

    if (typeof tokenFromUrl === 'string' && tokenFromUrl) {
      setToken(tokenFromUrl)
    }

    const currentUser = await fetchUser()

    if (currentUser) {
      await router.replace('/dashboard')
    } else {
      await router.replace('/login?error=auth_failed')
    }
  })
</script>

<template>
  <div class="max-w-md mx-auto w-full text-center py-12">
    <p class="text-on-surface opacity-60">
      正在完成登录…
    </p>
  </div>
</template>
