import type { AuthError, Session, User } from '@supabase/supabase-js'

export function useSupabaseAuth() {
  const { $supabase } = useNuxtApp()

  const user = useState<User | null>('auth-user', () => null)
  const session = useState<Session | null>('auth-session', () => null)
  const authLoading = useState('auth-loading', () => true)
  const authError = ref<string | null>(null)
  const authPending = ref(false)
  const isConfigured = computed(() => !!$supabase)

  const configError = 'Supabase is not configured. Check .env.local and restart the dev server.'

  function requireSupabase() {
    if (!$supabase) {
      authError.value = configError
      return null
    }
    return $supabase
  }

  const isLoggedIn = computed(() => !!user.value)
  const isAnonymous = computed(() => user.value?.is_anonymous ?? false)

  const displayName = computed(() => {
    if (!user.value) return ''
    const metadata = user.value.user_metadata
    if (metadata?.full_name) return String(metadata.full_name)
    if (user.value.email) return user.value.email.split('@')[0] ?? 'User'
    return isAnonymous.value ? 'Guest' : 'User'
  })

  const avatarUrl = computed(() => {
    const url = user.value?.user_metadata?.avatar_url
    return typeof url === 'string' ? url : undefined
  })

  const userInitial = computed(() => {
    const name = displayName.value.trim()
    return name ? name.charAt(0).toUpperCase() : '?'
  })

  function clearError() {
    authError.value = null
  }

  function setError(error: AuthError | Error | null) {
    authError.value = error?.message ?? null
  }

  async function signUp(email: string, password: string) {
    const client = requireSupabase()
    if (!client) return { ok: false as const }
    authPending.value = true
    clearError()
    const { data, error } = await client.auth.signUp({ email, password })
    authPending.value = false
    if (error) {
      setError(error)
      return { ok: false as const, error }
    }
    return {
      ok: true as const,
      needsConfirmation: !data.session,
    }
  }

  async function signIn(email: string, password: string) {
    const client = requireSupabase()
    if (!client) return { ok: false as const }
    authPending.value = true
    clearError()
    const { error } = await client.auth.signInWithPassword({ email, password })
    authPending.value = false
    if (error) {
      setError(error)
      return { ok: false as const, error }
    }
    return { ok: true as const }
  }

  async function signInWithGoogle() {
    const client = requireSupabase()
    if (!client) return { ok: false as const }
    authPending.value = true
    clearError()
    const redirectTo = import.meta.client
      ? `${window.location.origin}/auth/callback`
      : undefined
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    authPending.value = false
    if (error) {
      setError(error)
      return { ok: false as const, error }
    }
    return { ok: true as const }
  }

  async function signInAnonymously() {
    const client = requireSupabase()
    if (!client) return { ok: false as const }
    authPending.value = true
    clearError()
    const { error } = await client.auth.signInAnonymously()
    authPending.value = false
    if (error) {
      setError(error)
      return { ok: false as const, error }
    }
    return { ok: true as const }
  }

  async function signOut() {
    const client = requireSupabase()
    if (!client) return { ok: false as const }
    authPending.value = true
    clearError()
    const { error } = await client.auth.signOut()
    authPending.value = false
    if (error) {
      setError(error)
      return { ok: false as const, error }
    }
    return { ok: true as const }
  }

  return {
    user,
    session,
    authLoading,
    authError,
    authPending,
    isConfigured,
    isLoggedIn,
    isAnonymous,
    displayName,
    avatarUrl,
    userInitial,
    clearError,
    signUp,
    signIn,
    signInWithGoogle,
    signInAnonymously,
    signOut,
  }
}
