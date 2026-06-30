<script setup lang="ts">
const { weeklyTrends, bestsellers } = useMockProducts()
</script>

<template>
  <div>
    <HomeHeroBanner />
    <HomeCategoryGrid />

    <HomeProductCarousel
      title="Weekly Trends"
      :products="weeklyTrends"
      view-all-href="/best-deals/weekly-trends"
    />

    <HomeProductGrid
      title="Bestsellers"
      :products="bestsellers"
      view-all-href="/best-deals/best-gamers-choice"
    />

    <HomeGenreTabs />
    <HomeBudgetDeals />
    <HomePlusPromo />
    <HomeRandomKeysPromo />
    <HomeTrustBadges />
    <HomeAppDownload />
  </div>
</template>
