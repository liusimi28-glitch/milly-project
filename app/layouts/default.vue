<template>
  <div class="flex min-h-screen flex-col bg-g2a-gray">
    <header class="border-b border-g2a-border bg-white">
      <div class="bg-g2a-orange px-4 py-1.5 text-center text-xs text-white">
        Header · TopBar（阶段 1 实现）
      </div>
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <span class="text-2xl font-bold text-g2a-orange">G2A</span>
        <span class="text-sm text-g2a-muted">Search · Nav · Cart（阶段 1 实现）</span>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-g2a-border bg-g2a-dark text-white">
      <div class="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-white/70">
        Footer（阶段 1 实现）
      </div>
    </footer>
  </div>
</template>
