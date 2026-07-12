import type { UserRole, UserStatus } from '~/types/api/common'

export interface PlayerProfile {
  user_id: string
  nickname: string
  avatar_url?: string
  bio?: string
  created_at?: string
  updated_at?: string
}

export interface UserProfile {
  id: string
  email?: string
  role: UserRole
  status: UserStatus
  player_profile?: PlayerProfile
  created_at?: string
  updated_at?: string
}

export interface ClientUpdateProfileRequest {
  nickname: string
  avatar?: string
}
