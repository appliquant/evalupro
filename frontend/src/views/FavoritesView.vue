<template>
  <div class="container mt-3">
    <h1>Favoris</h1>
    {{ favorites }}
    {{ favoritesLoading }}
    {{ favoritesError }}

    <!-- Liste -->
    <ul class="list-group">
      <RouterLink class="list-group-item" to="/product/1">
        elm1
      </RouterLink>
      <RouterLink class="list-group-item" to="/product/1">
        elm1
      </RouterLink>
      <RouterLink class="list-group-item" to="/product/1">
        elm1
      </RouterLink>
      <RouterLink class="list-group-item" to="/product/1">
        elm1
      </RouterLink>
      <RouterLink class="list-group-item" to="/product/1">
        elm1
      </RouterLink>
    </ul>

  </div>
</template>

<script lang="ts" setup>
import { useUserFavorites } from '@/composables/useUserFavorites'

const {
  data: favorites,
  loading: favoritesLoading,
  error: favoritesError
} = useUserFavorites()
</script>