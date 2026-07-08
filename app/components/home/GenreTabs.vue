<script setup lang="ts">
const { genres, pending } = useHomepage()

const genreTabs = [
  { id: 'action', label: 'Action' },
  { id: 'rpg', label: 'RPG' },
  { id: 'horror', label: 'Horror' },
  { id: 'indie', label: 'Indie' },
  { id: 'sports', label: 'Sports' },
]

function getProducts(genre: string) {
  return genres.value[genre] ?? []
}
</script>

<template>
  <HomeProductTabGrid
    title="Shop by genre"
    :tabs="genreTabs"
    :get-products="getProducts"
    :loading="pending"
  />
</template>
