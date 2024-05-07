import { useAuthStore } from '@/stores/authStore'
import { type Ref, ref, toValue, watchEffect } from 'vue'
import type { ApiResponseType } from '@/types'
import { productsService } from '@/services/productsService'

export const useProducts = (productNameFilter?: Ref<string>) => {
  const authStore = useAuthStore()
  const data = ref<ApiResponseType | null>(null)
  const loading = ref(true)
  const error = ref<ApiResponseType | null>(null)

  const reload = () => {
    productsService
      .getProducts(authStore.jwt, productNameFilter && toValue(productNameFilter))
      .then((res) => (data.value = res))
      .catch((err) => (error.value = err))
      .finally(() => (loading.value = false))
  }

  // Au montage, charger les produits
  reload()

  // À chaque fois que le filtre de nom de produit change, recharger les produits
  watchEffect(() => {
    reload()
  })

  return { data, loading, error, reload }
}