import { computed, ref } from 'vue'

const TOKEN_KEY = 'token'

export interface AuthUser {
  id: number
  login: string
  name: string | null
  avatar_url: string
}

const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
const user = ref<AuthUser | null>(null)

export function useAuth () {
  const isAuthenticated = computed(() => !!token.value)

  function setToken (newToken: string) {
    token.value = newToken
    localStorage.setItem(TOKEN_KEY, newToken)
  }

  function clearToken () {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  function loginWithGitHub () {
    window.location.href = '/api/auth/github'
  }

  async function fetchUser () {
    if (!token.value) {
      user.value = null
      return null
    }

    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token.value}` },
    })

    if (!response.ok) {
      clearToken()
      return null
    }

    const data = await response.json()
    user.value = data.user as AuthUser
    return user.value
  }

  function logout () {
    clearToken()
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    clearToken,
    loginWithGitHub,
    fetchUser,
    logout,
  }
}
