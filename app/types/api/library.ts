import type { AcquireMethod } from '~/types/api/common'

export interface PlayerLibraryItem {
  id: number
  game_id: number
  player_id: string
  acquire_method: AcquireMethod
  play_time_minutes: number
  created_at?: string
  updated_at?: string
}

export interface UpdatePlayTimeRequest {
  minutes: number
}
