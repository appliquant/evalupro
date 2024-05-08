import { useAuthStore } from '@/stores/authStore'
import type { ApiResponseType } from '@/types'
import { ref } from 'vue'
import { criteriasService } from '@/services/criteriasService'

export const useCriterias = () => {
  const authStore = useAuthStore()
  const data = ref<ApiResponseType | null>(null)
  const loading = ref(true)
  const error = ref<ApiResponseType | null>(null)

  const reload = () => {
    criteriasService
      .getCriterias(authStore.jwt)
      .then((res) => (data.value = res))
      .catch((err) => (error.value = err))
      .finally(() => (loading.value = false))
  }

  reload()

  return { data, loading, error, reload }
}