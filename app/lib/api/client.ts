import type { ApiResponse } from '~/types/api/homepage'

export class ApiError extends Error {
  constructor(
    message: string,
    readonly code: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, '')
}

export async function apiGet<T>(
  baseUrl: string,
  path: string,
  query?: Record<string, string | undefined>,
): Promise<T> {
  if (!baseUrl) {
    throw new ApiError('API base URL is not configured', -1)
  }

  const url = `${normalizeBaseUrl(baseUrl)}${path}`
  const response = await $fetch<ApiResponse<T>>(url, { query })

  if (response.error_no !== 0) {
    throw new ApiError(response.error_msg || 'API request failed', response.error_no)
  }

  return response.data
}
