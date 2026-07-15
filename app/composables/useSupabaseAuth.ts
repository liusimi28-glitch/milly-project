import type { AuthError, Session, User } from '@supabase/supabase-js'
import { buildAuthCallbackUrl } from '~/lib/auth-redirect'
import { resolveAuthAvatarUrl } from '~/lib/auth-avatar'

export function useSupabaseAuth() {
  const { $supabase } = useNuxtApp()

  const user = useState<User | null>('auth-user', () => null)
  const session = useState<Session | null>('auth-session', () => null)
  const authLoading = useState('auth-loading', () => true)
  const authError = ref<string | null>(null)
  const authPending = ref(false)
  const isConfigured = computed(() => !!$supabase)

  const configError = 'Supabase 未配置。请检查 .env.local 后重启开发服务器。'

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

  const avatarUrl = computed(() => resolveAuthAvatarUrl(user.value))

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

  function buildAuthOptions(captchaToken?: string) {
    return captchaToken ? { captchaToken } : undefined
  }

  function buildRedirectTo(redirectPath?: string | null) {
    if (!import.meta.client) return undefined
    return buildAuthCallbackUrl(window.location.origin, redirectPath)
  }

  async function signUp(email: string, password: string, captchaToken?: string) {
    const client = requireSupabase()
    if (!client) return { ok: false as const }
    authPending.value = true
    clearError()
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: buildRedirectTo(),
        ...buildAuthOptions(captchaToken),
      },
    })
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

  async function signIn(email: string, password: string, captchaToken?: string) {
    const client = requireSupabase()
    if (!client) return { ok: false as const }
    authPending.value = true
    clearError()
    const { error } = await client.auth.signInWithPassword({
      email,
      password,
      options: buildAuthOptions(captchaToken),
    })
    authPending.value = false
    if (error) {
      setError(error)
      return { ok: false as const, error }
    }
    return { ok: true as const }
  }

  async function signInWithGoogle(redirectPath?: string | null) {
    const client = requireSupabase()
    if (!client) return { ok: false as const }
    authPending.value = true
    clearError()
    const redirectTo = buildRedirectTo(redirectPath)
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    // OAuth 成功时会整页跳离；仅在本地错误时结束 pending
    if (error) {
      authPending.value = false
      setError(error)
      return { ok: false as const, error }
    }
    return { ok: true as const }
  }

  async function signInAnonymously(captchaToken?: string) {
    const client = requireSupabase()
    if (!client) return { ok: false as const }
    authPending.value = true
    clearError()
    const { error } = await client.auth.signInAnonymously({
      options: buildAuthOptions(captchaToken),
    })
    authPending.value = false
    if (error) {
      setError(error)
      return { ok: false as const, error }
    }
    return { ok: true as const }
  }

  async function resendConfirmation(email: string, captchaToken?: string) {
    const client = requireSupabase()
    if (!client) return { ok: false as const }
    authPending.value = true
    clearError()
    const { error } = await client.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: buildRedirectTo(),
        ...buildAuthOptions(captchaToken),
      },
    })
    authPending.value = false
    if (error) {
      setError(error)
      return { ok: false as const, error }
    }
    return { ok: true as const }
  }

  async function signInWithOtp(email: string, captchaToken?: string) {
    const client = requireSupabase()
    if (!client) return { ok: false as const }
    authPending.value = true
    clearError()
    const { error } = await client.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: buildRedirectTo(),
        ...buildAuthOptions(captchaToken),
      },
    })
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
    signInWithOtp,
    resendConfirmation,
    signInWithGoogle,
    signInAnonymously,
    signOut,
  }
}
