import { fetchProfile, updateProfile } from '~/lib/api/profile'
import type { ClientUpdateProfileRequest, UserProfile } from '~/types/api/profile'

export function useProfile() {
  const { authClient } = useApiClient()
  const { isLoggedIn } = useApiAuth()

  const { data, pending, error, refresh } = useAsyncData<UserProfile | null>(
    'user-profile',
    async () => {
      if (!isLoggedIn.value) return null
      return fetchProfile(authClient.value)
    },
    {
      watch: [isLoggedIn],
    },
  )

  async function saveProfile(body: ClientUpdateProfileRequest) {
    await updateProfile(authClient.value, body)
    await refresh()
  }

  return {
    profile: data,
    pending,
    error,
    refresh,
    saveProfile,
  }
}
