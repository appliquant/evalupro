import { useAuthStore } from '@/stores/authStore'
import type { ApiResponseType } from '@/types'
import { ref } from 'vue'
import { favoritesService } from '@/services/favoritesService'

export const useUserFavorites = () => {
  const authStore = useAuthStore()
  const data = ref<ApiResponseType | null>(null)
  const loading = ref(true)
  const error = ref<ApiResponseType | null>(null)

  const reload = () => {
    favoritesService
      .getFavorites(authStore.jwt)
      .then((res) => (data.value = res))
      .catch((err) => (error.value = err))
      .finally(() => (loading.value = false))
  }

  reload()

  return { data, loading, error, reload }
}