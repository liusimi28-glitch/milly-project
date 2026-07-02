<script setup lang="ts">
const { budgetUnder5, budgetUnder10 } = useMockProducts()

const budgetTabs = [
  { id: 'under-5', label: 'Under $5' },
  { id: 'under-10', label: 'Under $10' },
]

function getProducts(tabId: string) {
  return tabId === 'under-5' ? budgetUnder5 : budgetUnder10
}
</script>

<template>
  <HomeProductTabGrid
    title="Budget deals"
    :tabs="budgetTabs"
    :get-products="getProducts"
  />
</template>
