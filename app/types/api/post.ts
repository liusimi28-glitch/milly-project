export type PostStatus = 'draft' | 'review' | 'published' | 'rejected' | 'deleted'

export interface PostMedia {
  id: number
  url?: string
  thumbnail_url?: string
  media_type?: string
}

export interface PostTag {
  id: number
  code: string
  name?: string
}

export interface Post {
  id: number
  title: string
  content?: string
  postType?: string
  accessType?: string
  price?: number
  teaserLimit?: number
  status?: PostStatus
  creatorID?: string
  tags?: PostTag[]
  media?: PostMedia[]
  createdAt?: string
  updatedAt?: string
}
