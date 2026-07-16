<script setup lang="ts">
import type { PlayableGame } from '~/composables/usePlayableGames'

const { games, pending, error, refresh } = usePlayableGames()

const activeGame = ref<PlayableGame | null>(null)
const modalOpen = ref(false)

function openGame(game: PlayableGame) {
  activeGame.value = game
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  activeGame.value = null
}

useHead({ title: '在线玩影游 | milly-project' })
</script>

<template>
  <div>
    <MallMallNav />

    <div class="mx-auto max-w-7xl px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-g2a-text">
          在线玩影游
        </h1>
        <p class="mt-2 text-sm text-g2a-muted">
          <!-- TODO: replace with GET /api/v1/client/games/playable -->
          当前优先展示游戏库中的游戏；若无数据则回退到游戏列表 mock 游玩链接
        </p>
      </div>

      <p
        v-if="error"
        class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        加载失败
        <button type="button" class="ml-2 font-medium underline" @click="refresh()">
          重试
        </button>
      </p>

      <div v-if="pending && games.length === 0" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProductProductCardSkeleton v-for="index in 4" :key="index" />
      </div>

      <div
        v-else-if="games.length > 0"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <article
          v-for="game in games"
          :key="game.id"
          class="overflow-hidden rounded-xl border border-g2a-border bg-white"
        >
          <div class="aspect-[462/174] bg-g2a-gray">
            <img
              :src="game.image"
              :alt="game.title"
              class="size-full object-cover"
            >
          </div>
          <div class="p-4">
            <div class="mb-2 flex items-center justify-between gap-2">
              <h2 class="line-clamp-2 text-sm font-semibold text-g2a-text">
                {{ game.title }}
              </h2>
              <span
                v-if="game.genreLabel"
                class="shrink-0 rounded bg-g2a-gray px-2 py-0.5 text-[10px] font-medium text-g2a-muted"
              >
                {{ game.genreLabel }}
              </span>
            </div>
            <button
              type="button"
              class="mt-3 w-full rounded-lg bg-g2a-orange px-4 py-2 text-sm font-semibold text-white hover:bg-g2a-orange/90"
              @click="openGame(game)"
            >
              开始游戏
            </button>
          </div>
        </article>
      </div>

      <div v-else class="rounded-xl border border-g2a-border bg-white p-12 text-center text-sm text-g2a-muted">
        暂无可在线玩的游戏
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="modalOpen && activeGame"
        class="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="`${activeGame.title} 游戏窗口`"
      >
        <div class="flex w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
          <div class="flex items-center justify-between border-b border-g2a-border px-4 py-3">
            <h3 class="font-semibold text-g2a-text">
              {{ activeGame.title }}
            </h3>
            <button
              type="button"
              class="rounded-md px-3 py-1 text-sm text-g2a-muted hover:bg-g2a-gray"
              @click="closeModal"
            >
              关闭
            </button>
          </div>
          <div class="aspect-video bg-black">
            <iframe
              :src="activeGame.playUrl"
              :title="activeGame.title"
              class="size-full"
              allow="fullscreen"
            />
          </div>
          <div class="flex justify-end gap-3 border-t border-g2a-border px-4 py-3">
            <a
              :href="activeGame.playUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm font-medium text-g2a-blue hover:underline"
            >
              新窗口打开
            </a>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
