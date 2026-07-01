<script setup lang="ts">
const { weeklyTrends, bestsellers } = useMockProducts()
</script>

<template>
  <div>
    <HomeHeroBanner />

    <HomeScrollReveal immediate>
      <HomeCategoryGrid />
    </HomeScrollReveal>

    <HomeScrollReveal immediate :delay="50">
      <HomeProductCarousel
        title="Weekly Trends"
        :products="weeklyTrends"
        view-all-href="/best-deals/weekly-trends"
      />
    </HomeScrollReveal>

    <HomeScrollReveal :delay="50">
      <HomeProductGrid
        title="Bestsellers"
        :products="bestsellers"
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
