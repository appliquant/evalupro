import { useAuthStore } from '@/stores/authStore'
import type { ApiResponseType } from '@/types'
import { ref } from 'vue'
import { categoriesService } from '@/services/categoriesService'

export const useCategories = () => {
  const authStore = useAuthStore()
  const data = ref<ApiResponseType | null>(null)
  const loading = ref(true)
  const error = ref<ApiResponseType | null>(null)

  categoriesService
    .getCategories(authStore.jwt)
    .then((res) => (data.value = res))
    .catch((err) => (error.value = err))
    .finally(() => (loading.value = false))

  return { data, loading, error }
}