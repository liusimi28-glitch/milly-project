<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'
import { UserIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  closeMegaMenu?: () => void
}>()

const open = defineModel<boolean>('open', { default: false })
const rootRef = ref<HTMLElement | null>(null)
const panelId = 'auth-dropdown-panel'

const route = useRoute()
const {
  authLoading,
  authPending,
  user,
  isLoggedIn,
  isAnonymous,
  displayName,
  avatarUrl,
  userInitial,
  signOut,
} = useSupabaseAuth()

function toggleOpen() {
  if (!open.value) {
    props.closeMegaMenu?.()
  }
  open.value = !open.value
}

function close() {
  open.value = false
}

async function handleSignOut() {
  const result = await signOut()
  if (result.ok) {
    close()
  }
}

onClickOutside(rootRef, () => {
  if (open.value) close()
})

useEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    close()
  }
})

watch(() => route.fullPath, () => {
  close()
})

watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) close()
})
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      class="inline-flex size-10 items-center justify-center rounded-md text-g2a-text transition-all duration-[var(--motion-fast)] hover:bg-g2a-gray hover:text-g2a-orange focus-visible:ring-2 focus-visible:ring-g2a-orange focus-visible:ring-offset-2 focus-visible:outline-none"
      :aria-expanded="open"
      aria-haspopup="menu"
      :aria-controls="panelId"
      aria-label="Account"
      data-test-id="dropdown-button-icon"
      @click="toggleOpen"
    >
      <div
        v-if="isLoggedIn"
        class="relative flex size-8 items-center justify-center overflow-hidden rounded-full bg-g2a-dark text-sm font-bold text-white"
      >
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="displayName"
          class="size-full object-cover"
        >
        <span v-else>{{ userInitial }}</span>
      </div>
      <UserIcon v-else class="size-5" />
    </button>

    <Transition
      enter-active-class="transition duration-[var(--motion-base)] ease-[var(--ease-out)]"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-[var(--motion-fast)] ease-[var(--ease-out)]"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="open"
        :id="panelId"
        role="menu"
        class="absolute top-[calc(100%+0.5rem)] right-0 z-[80] w-[min(300px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-g2a-border bg-white shadow-lg max-sm:fixed max-sm:top-16 max-sm:right-4 max-sm:left-auto max-sm:max-h-[calc(100dvh-5rem)] max-sm:overflow-y-auto"
        data-test-id="dropdown-panel"
      >
        <div v-if="authLoading" class="px-4 py-6 text-center text-sm text-g2a-muted">
          Loading…
        </div>

        <LayoutAuthFormPanel
          v-else-if="!isLoggedIn"
          @success="close"
        />

        <div v-else class="py-3.5" data-test-id="dropdown-menu">
          <div class="px-4 pb-3">
            <p class="text-base font-semibold text-g2a-text">
              {{ displayName }}
            </p>
            <p v-if="isAnonymous" class="mt-1 text-xs text-g2a-muted">
              Guest account
            </p>
            <p v-else-if="user?.email" class="mt-1 truncate text-xs text-g2a-muted">
              {{ user.email }}
            </p>
          </div>

          <div class="border-t border-g2a-border px-4 pt-3">
            <Button
              type="button"
              variant="outline"
              class="h-10 w-full border-g2a-border text-g2a-text hover:bg-g2a-gray"
              :disabled="authPending"
              @click="handleSignOut"
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
