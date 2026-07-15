<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const emit = defineEmits<{
  success: []
}>()

const route = useRoute()

const {
  authError,
  authPending,
  clearError,
  signUp,
  signIn,
  signInWithOtp,
  resendConfirmation,
  signInWithGoogle,
  signInAnonymously,
} = useSupabaseAuth()

const runtimeConfig = useRuntimeConfig()
const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const infoMessage = ref<string | null>(null)
const otpMessage = ref<string | null>(null)
const confirmEmail = ref<string | null>(null)
const turnstileToken = ref<string | null>(null)
const turnstileRef = ref<{ reset: () => void } | null>(null)
const resendCountdown = useCountdown()
const otpCountdown = useCountdown()

const captchaEnabled = computed(() => String(runtimeConfig.public.captchaEnabled).toLowerCase() === 'true')
const turnstileSiteKey = computed(() => String(runtimeConfig.public.turnstileSiteKey || ''))
const captchaReady = computed(() => !captchaEnabled.value || !!turnstileToken.value)

function resetCaptcha() {
  turnstileRef.value?.reset()
}

async function handleEmailSubmit() {
  const trimmedEmail = email.value.trim()
  if (!trimmedEmail || !password.value) return
  if (!captchaReady.value) {
    infoMessage.value = '请先完成验证。'
    return
  }

  const result = mode.value === 'register'
    ? await signUp(trimmedEmail, password.value, turnstileToken.value ?? undefined)
    : await signIn(trimmedEmail, password.value, turnstileToken.value ?? undefined)
  resetCaptcha()

  if (result.ok) {
    if ('needsConfirmation' in result && result.needsConfirmation) {
      confirmEmail.value = trimmedEmail
      resendCountdown.start(60)
      infoMessage.value = '请查收邮件以确认账号。'
      return
    }
    confirmEmail.value = null
    emit('success')
  }
}

async function handleGoogleSignIn() {
  // OAuth 将整页跳转，成功时不要 emit('success')
  await signInWithGoogle(route.fullPath)
}

async function handleAnonymousSignIn() {
  if (!captchaReady.value) {
    infoMessage.value = '请先完成验证。'
    return
  }
  const result = await signInAnonymously(turnstileToken.value ?? undefined)
  resetCaptcha()
  if (result.ok) {
    emit('success')
  }
}

async function handleResendConfirmation() {
  const targetEmail = confirmEmail.value ?? email.value.trim()
  if (!targetEmail || resendCountdown.active.value) return
  if (!captchaReady.value) {
    infoMessage.value = '请先完成验证。'
    return
  }
  const result = await resendConfirmation(targetEmail, turnstileToken.value ?? undefined)
  resetCaptcha()
  if (result.ok) {
    resendCountdown.start(60)
    infoMessage.value = '确认邮件已重新发送。'
  }
}

async function handleOtpSignIn() {
  const trimmedEmail = email.value.trim()
  if (!trimmedEmail || otpCountdown.active.value) return
  if (!captchaReady.value) {
    infoMessage.value = '请先完成验证。'
    return
  }
  const result = await signInWithOtp(trimmedEmail, turnstileToken.value ?? undefined)
  resetCaptcha()
  if (result.ok) {
    otpCountdown.start(60)
    otpMessage.value = '登录链接已发送，请查收邮箱。'
  }
}

function switchMode(next: 'login' | 'register') {
  mode.value = next
  infoMessage.value = null
  otpMessage.value = null
  confirmEmail.value = null
  resendCountdown.stop()
  otpCountdown.stop()
  clearError()
  resetCaptcha()
}

watch([email, password], () => {
  if (authError.value) clearError()
  if (infoMessage.value) infoMessage.value = null
  if (otpMessage.value) otpMessage.value = null
})
</script>

<template>
  <div class="py-3.5" data-test-id="dropdown-menu">
    <div class="px-4 pb-3">
      <p class="text-base font-semibold text-g2a-text">
        欢迎！
      </p>
      <p class="mt-1 text-xs text-g2a-muted">
        登录后可同步订单与偏好设置。
      </p>
    </div>

    <div class="space-y-2 px-4">
      <Button
        type="button"
        variant="outline"
        class="h-10 w-full justify-center gap-2 border-g2a-border text-g2a-text hover:bg-g2a-gray"
        :disabled="authPending"
        @click="handleGoogleSignIn"
      >
        <svg class="size-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        {{ authPending ? '正在跳转…' : '使用 Google 登录' }}
      </Button>

      <div class="relative py-2">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t border-g2a-border" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-white px-2 text-g2a-muted">或</span>
        </div>
      </div>

      <form class="space-y-2" @submit.prevent="handleEmailSubmit">
        <Input
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="邮箱"
          class="h-10 border-g2a-border"
          :disabled="authPending"
          required
        />
        <Input
          v-model="password"
          type="password"
          :autocomplete="mode === 'register' ? 'new-password' : 'current-password'"
          placeholder="密码"
          class="h-10 border-g2a-border"
          :disabled="authPending"
          minlength="6"
          required
        />

        <AuthTurnstileWidget
          v-if="captchaEnabled"
          ref="turnstileRef"
          v-model="turnstileToken"
          :enabled="captchaEnabled"
          :site-key="turnstileSiteKey"
        />

        <p v-if="infoMessage" class="text-xs text-g2a-muted" role="status">
          {{ infoMessage }}
        </p>

        <p v-if="otpMessage" class="text-xs text-g2a-muted" role="status">
          {{ otpMessage }}
        </p>

        <p v-if="authError" class="text-xs text-destructive" role="alert">
          {{ authError }}
        </p>

        <Button
          type="submit"
          class="h-10 w-full bg-g2a-orange text-white hover:bg-g2a-orange/90"
          :disabled="authPending"
        >
          {{ mode === 'register' ? '创建账号' : '登录' }}
        </Button>

        <Button
          v-if="mode === 'login'"
          type="button"
          variant="outline"
          class="h-10 w-full border-g2a-border text-g2a-text hover:bg-g2a-gray"
          :disabled="authPending || otpCountdown.active"
          @click="handleOtpSignIn"
        >
          {{ otpCountdown.active ? `${otpCountdown.remaining}s 后可重发魔法链接` : '发送邮件登录链接' }}
        </Button>

        <Button
          v-if="mode === 'register' && confirmEmail"
          type="button"
          variant="ghost"
          class="h-9 w-full text-g2a-muted hover:bg-g2a-gray"
          :disabled="authPending || resendCountdown.active"
          @click="handleResendConfirmation"
        >
          {{ resendCountdown.active ? `${resendCountdown.remaining}s 后可重发确认邮件` : '重发确认邮件' }}
        </Button>
      </form>

      <Button
        type="button"
        variant="ghost"
        class="h-10 w-full text-g2a-text hover:bg-g2a-gray"
        :disabled="authPending"
        @click="handleAnonymousSignIn"
      >
        以访客身份继续
      </Button>
    </div>

    <div class="mt-3 border-t border-g2a-border px-4 pt-3">
      <p class="text-center text-xs text-g2a-muted">
        <template v-if="mode === 'login'">
          还没有账号？
          <button
            type="button"
            class="font-medium text-g2a-orange hover:underline"
            @click="switchMode('register')"
          >
            注册
          </button>
        </template>
        <template v-else>
          已有账号？
          <button
            type="button"
            class="font-medium text-g2a-orange hover:underline"
            @click="switchMode('login')"
          >
            登录
          </button>
        </template>
      </p>
      <p class="mt-2 text-[11px] leading-relaxed text-g2a-muted">
        使用 Google 或邮箱登录，即表示你同意我们的服务条款与隐私政策。
      </p>
    </div>
  </div>
</template>
