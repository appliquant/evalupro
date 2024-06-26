import { useAuthStore } from '@/stores/authStore'
import { type Ref, ref, toValue, watchEffect } from 'vue'
import type { ApiResponseType } from '@/types'
import { productsService } from '@/services/productsService'

export const useProduct = (id: Ref<null | string>) => {
  const authStore = useAuthStore()
  const data = ref<ApiResponseType | null>(null)
  const loading = ref(true)
  const error = ref<ApiResponseType | null>(null)

  const reload = () => {
    productsService
      .getProduct(authStore.jwt, toValue(id)!)
      .then((res) => (data.value = res))
      .catch((err) => (error.value = err))
      .finally(() => (loading.value = false))
  }

  watchEffect(() => {
    if (id.value) {
      reload()
    }
  })

  return { data, loading, error }
}
