<script setup lang="ts">
const {
  weeklyTrends,
  bestsellers,
  pending,
  error,
  refresh,
} = useHomepage()

const errorMessage = computed(() => {
  if (!error.value) return ''
  if (error.value instanceof Error) return error.value.message
  return 'Unknown error'
})
</script>

<template>
  <div>
    <p
      v-if="error"
      class="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      role="alert"
    >
      Failed to load homepage data.
      <span v-if="errorMessage" class="ml-1 opacity-80">({{ errorMessage }})</span>
      <button
        type="button"
        class="ml-2 font-medium underline"
        @click="refresh()"
      >
        Retry
      </button>
    </p>

    <HomeHeroBanner />

    <HomeScrollReveal immediate>
      <HomeCategoryGrid />
    </HomeScrollReveal>

    <HomeScrollReveal immediate :delay="50">
      <HomeProductCarousel
        title="Weekly Trends"
        :products="weeklyTrends"
        :loading="pending"
        view-all-href="/best-deals/weekly-trends"
      />
    </HomeScrollReveal>

    <HomeScrollReveal :delay="50">
      <HomeProductGrid
        title="Bestsellers"
        :products="bestsellers"
        :loading="pending"
        view-all-href="/best-deals/best-gamers-choice"
      />
    </HomeScrollReveal>

    <HomeScrollReveal :delay="50">
      <HomeGenreTabs />
    </HomeScrollReveal>

    <HomeScrollReveal :delay="50">
      <HomeBudgetDeals />
    </HomeScrollReveal>

    <HomeScrollReveal :delay="50">
      <HomePlusPromo />
    </HomeScrollReveal>

    <HomeScrollReveal :delay="50">
      <HomeRandomKeysPromo />
    </HomeScrollReveal>

    <HomeScrollReveal :delay="50">
      <HomeTrustBadges />
    </HomeScrollReveal>

    <HomeScrollReveal :delay="50">
      <HomeAppDownload />
    </HomeScrollReveal>
  </div>
</template>
