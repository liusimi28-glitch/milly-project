import { createClient, type Session, type User } from '@supabase/supabase-js'

let authListenerRegistered = false

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()

  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseAnonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '[supabase] Missing NUXT_PUBLIC_SUPABASE_URL or NUXT_PUBLIC_SUPABASE_ANON_KEY. '
      + 'Add them to .env.local and restart the dev server.',
    )
    useState('auth-loading', () => true).value = false
    return {
      provide: {
        supabase: null,
      },
    }
  }

  const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  )

  const user = useState<User | null>('auth-user', () => null)
  const session = useState<Session | null>('auth-session', () => null)
  const authLoading = useState('auth-loading', () => true)

  const { data, error } = await supabase.auth.getSession()
  if (!error) {
    session.value = data.session
    user.value = data.session?.user ?? null
  }
  authLoading.value = false

  if (!authListenerRegistered) {
    authListenerRegistered = true
    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null
    })
  }

  return {
    provide: {
      supabase,
    },
  }
})
