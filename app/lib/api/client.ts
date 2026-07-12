import type { ApiResponse } from '~/types/api/common'

export class ApiError extends Error {
  constructor(
    message: string,
    readonly code: number,
    readonly statusCode?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401 || this.code === 401
  }

  get isForbidden(): boolean {
    return this.statusCode === 403 || this.code === 403
  }
}

export type TokenGetter = () => string | null | undefined

export interface ApiClient {
  get: <T>(path: string, query?: Record<string, string | number | undefined>) => Promise<T>
  post: <T>(path: string, body?: unknown, query?: Record<string, string | number | undefined>) => Promise<T>
  put: <T>(path: string, body?: unknown, query?: Record<string, string | number | undefined>) => Promise<T>
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, '')
}

function buildHeaders(getToken?: TokenGetter): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  const token = getToken?.()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

function serializeQuery(query?: Record<string, string | number | undefined>): Record<string, string> | undefined {
  if (!query) return undefined

  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue
    result[key] = String(value)
  }

  return Object.keys(result).length > 0 ? result : undefined
}

async function request<T>(
  baseUrl: string,
  method: 'GET' | 'POST' | 'PUT',
  path: string,
  options?: {
    body?: unknown
    query?: Record<string, string | number | undefined>
    getToken?: TokenGetter
  },
): Promise<T> {
  if (!baseUrl) {
    throw new ApiError('API base URL is not configured', -1)
  }

  const url = `${normalizeBaseUrl(baseUrl)}${path}`

  try {
    const response = await $fetch<ApiResponse<T>>(url, {
      method,
      query: serializeQuery(options?.query),
      body: options?.body,
      headers: buildHeaders(options?.getToken),
    })

    if (response.error_no !== 0) {
      throw new ApiError(response.error_msg || 'API request failed', response.error_no)
    }

    return response.data
  }
  catch (error) {
    if (error instanceof ApiError) throw error

    const fetchError = error as { statusCode?: number, status?: number, data?: ApiResponse<unknown>, message?: string }
    const statusCode = fetchError.statusCode ?? fetchError.status
    const apiBody = fetchError.data

    if (apiBody && typeof apiBody.error_no === 'number') {
      throw new ApiError(apiBody.error_msg || 'API request failed', apiBody.error_no, statusCode)
    }

    if (statusCode === 401) {
      throw new ApiError('请先登录', 401, 401)
    }

    if (statusCode === 403) {
      throw new ApiError('没有权限访问此资源', 403, 403)
    }

    throw new ApiError(fetchError.message || 'Network request failed', -1, statusCode)
  }
}

export function createApiClient(baseUrl: string, getToken?: TokenGetter): ApiClient {
  return {
    get: <T>(path: string, query?: Record<string, string | number | undefined>) =>
      request<T>(baseUrl, 'GET', path, { query, getToken }),
    post: <T>(path: string, body?: unknown, query?: Record<string, string | number | undefined>) =>
      request<T>(baseUrl, 'POST', path, { body, query, getToken }),
    put: <T>(path: string, body?: unknown, query?: Record<string, string | number | undefined>) =>
      request<T>(baseUrl, 'PUT', path, { body, query, getToken }),
  }
}

/** @deprecated Use createApiClient().get */
export async function apiGet<T>(
  baseUrl: string,
  path: string,
  query?: Record<string, string | undefined>,
): Promise<T> {
  return createApiClient(baseUrl).get<T>(path, query)
}
