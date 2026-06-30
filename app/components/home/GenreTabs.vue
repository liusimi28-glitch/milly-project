<script setup lang="ts">
const { getByGenre } = useMockProducts()

const genres = [
  { id: 'action', label: 'Action' },
  { id: 'rpg', label: 'RPG' },
  { id: 'horror', label: 'Horror' },
  { id: 'indie', label: 'Indie' },
  { id: 'sports', label: 'Sports' },
]

function getProducts(genre: string) {
  return getByGenre(genre, 8)
}
</script>

<template>
  <HomeProductTabGrid
    title="Shop by genre"
    :tabs="genres"
    :get-products="getProducts"
  />
</template>
