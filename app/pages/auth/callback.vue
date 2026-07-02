<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { authLoading } = useSupabaseAuth()

useSeoMeta({ title: 'Signing in…' })

watch(
  () => authLoading.value,
  (loading) => {
    if (!loading) {
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
      router.replace(redirect)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex min-h-[50vh] items-center justify-center px-4">
    <p class="text-sm text-g2a-muted">
      Completing sign in…
    </p>
  </div>
</template>
