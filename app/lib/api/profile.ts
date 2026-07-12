import type { ApiClient } from '~/lib/api/client'
import type { ClientUpdateProfileRequest, UserProfile } from '~/types/api/profile'

export function fetchProfile(client: ApiClient): Promise<UserProfile> {
  return client.get<UserProfile>('/api/v1/client/profile')
}

export function updateProfile(
  client: ApiClient,
  body: ClientUpdateProfileRequest,
): Promise<void> {
  return client.put<void>('/api/v1/client/profile', body)
}
