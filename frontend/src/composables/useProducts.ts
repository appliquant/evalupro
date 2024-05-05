import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'
import type { ApiResponseType } from '@/types'
import { productsService } from '@/services/productsService'

export const useProducts = () => {
  const authStore = useAuthStore()
  const data = ref<ApiResponseType | null>(null)
  const loading = ref(true)
  const error = ref<ApiResponseType | null>(null)

  const reload = () => {
    productsService
      .getProducts(authStore.jwt)
      .then((res) => (data.value = res))
      .catch((err) => (error.value = err))
      .finally(() => (loading.value = false))
  }

  reload()

  return { data, loading, error, reload }
}