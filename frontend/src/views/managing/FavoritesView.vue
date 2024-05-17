<template>
  <div class="container mt-3">
    <h1>Favoris</h1>

    <p v-if="favoritesLoading" class="text-info">Chargement...</p>
    <p v-else-if="favoritesError" class="text-danger">{{ favoritesError }}</p>
    <p v-if="favorites?.data.length <= 0">Aucun favori</p>

    <!-- Liste -->
    <ul class="list-group">
      <RouterLink
        class="list-group-item"
        v-for="favorite in favorites?.data"
        :key="favorite.id"
        :to="`/product/${favorite.id}`"
      >
        <!-- Badge prix -->
        <span class="badge bg-primary rounded-pill">{{ favorite.price }} $</span>

        <!-- Nom -->
        {{ favorite.name }}

        <!-- Bouton de suppression -->
        <button
          class="btn btn-danger btn-sm float-end"
          @click.prevent="removeFavorite(favorite.id)"
        >
          Supprimer
        </button>
      </RouterLink>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useUserFavorites } from '@/composables/useUserFavorites'
import type { ApiResponseType } from '@/types'
import { push } from 'notivue'
import { favoritesService } from '@/services/favoritesService'
import { useAuthStore } from '@/stores/authStore'

const {
  data: favorites,
  loading: favoritesLoading,
  error: favoritesError,
  reload: reloadFavorites
} = useUserFavorites()

const authStore = useAuthStore()

const removeFavorite = async (favoriteId: string) => {
  try {
    const confirmation = confirm('Voulez-vous vraiment retirer ce produit de vos favoris ?')
    if (!confirmation) return

    const res = await favoritesService.removeFavorite(authStore.jwt, favoriteId)

    if (res.status !== 200) {
      return push.error({
        title: 'Erreur',
        message: 'Une erreur est survenue',
        duration: 5000
      })
    }

    push.success({
      title: 'Succès',
      message: 'Le produit a été retiré de vos favoris',
      duration: 5000
    })

    reloadFavorites()
  } catch (e) {
    const err = e as ApiResponseType
    push.error({
      title: 'Erreur',
      message: err.message,
      duration: 5000
    })
  }
}
</script>
