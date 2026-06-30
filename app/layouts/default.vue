<template>
  <div class="flex min-h-screen flex-col bg-g2a-gray">
    <LayoutAppTopBar />
    <LayoutAppHeader />

    <main class="flex-1">
      <slot />
    </main>

    <LayoutAppFooter />
  </div>
</template>
