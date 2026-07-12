import { fetchPost, fetchPosts } from '~/lib/api/post'
import type { Post } from '~/types/api/post'

export function usePosts(query?: MaybeRefOrGetter<string | undefined>) {
  const { publicClient } = useApiClient()
  const searchQuery = computed(() => toValue(query)?.trim() || undefined)

  const { data, pending, error, refresh } = useAsyncData<Post[]>(
    () => `posts-${searchQuery.value ?? ''}`,
    async () => {
      const result = await fetchPosts(publicClient.value, {
        page: 1,
        size: 20,
        query: searchQuery.value,
      })
      return result.items
    },
    {
      default: () => [],
      watch: [searchQuery],
    },
  )

  return {
    posts: data,
    pending,
    error,
    refresh,
  }
}

export function usePostDetail(postId: MaybeRefOrGetter<string>) {
  const { publicClient } = useApiClient()

  const { data, pending, error, refresh } = useAsyncData(
    () => `post-detail-${toValue(postId)}`,
    async () => {
      const id = toValue(postId)
      if (!id) return null
      return fetchPost(publicClient.value, id)
    },
    {
      watch: [() => toValue(postId)],
    },
  )

  return {
    post: data,
    pending,
    error,
    refresh,
  }
}
