import { createApiClient, type ApiClient } from '~/lib/api/client'

export function useApiClient() {
  const config = useRuntimeConfig()
  const { session } = useSupabaseAuth()

  const baseUrl = computed(() => config.public.apiBaseUrl)

  const publicClient = computed<ApiClient>(() =>
    createApiClient(baseUrl.value),
  )

  const authClient = computed<ApiClient>(() =>
    createApiClient(baseUrl.value, () => session.value?.access_token),
  )

  return {
    publicClient,
    authClient,
    baseUrl,
  }
}

export function useApiAuth() {
  const { session, isLoggedIn } = useSupabaseAuth()

  function getAccessToken(): string | null {
    return session.value?.access_token ?? null
  }

  function requireAccessToken(): string {
    const token = getAccessToken()
    if (!token) {
      throw new Error('请先登录')
    }
    return token
  }

  return {
    session,
    isLoggedIn,
    getAccessToken,
    requireAccessToken,
  }
}
