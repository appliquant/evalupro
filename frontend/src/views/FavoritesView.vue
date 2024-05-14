<template>
  <div class="container mt-3">
    <h1>Favoris</h1>
    {{ favorites }}
    {{ favoritesLoading }}
    {{ favoritesError }}

    <!-- Liste -->
    <ul class="list-group">
      <RouterLink class="list-group-item" v-for="favorite in favorites?.data" :key="favorite.id"
                  :to="`/product/${favorite.id}`">
        <!-- Badge prix -->
        <span class="badge bg-primary rounded-pill">{{ favorite.price }} $</span>
        
        <!-- Nom -->
        {{ favorite.name }}
        
        <!-- Bouton de suppression -->
        <button class="btn btn-danger btn-sm float-end">Supprimer</button>
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