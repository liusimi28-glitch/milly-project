import type { ApiClient } from '~/lib/api/client'
import type { ListResult } from '~/types/api/common'
import type { Post } from '~/types/api/post'

export function fetchPosts(
  client: ApiClient,
  params?: { page?: number, size?: number, query?: string },
): Promise<ListResult<Post>> {
  return client.get<ListResult<Post>>('/api/v1/client/post', params)
}

export function fetchPost(client: ApiClient, id: string): Promise<Post> {
  return client.get<Post>(`/api/v1/client/post/${encodeURIComponent(id)}`)
}
