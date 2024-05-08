import type { ApiResponseType } from '@/types'
import { handleApiResponse } from '@/services/handleApiResponse'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const getCriterias = async (jwt: string): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/criterias`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      }
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: 'Impossible d\'attendre le serveur lors de la récupérations des critères',
      errors: [
        {
          field: 'network',
          message:
            e instanceof Error ? e.message : 'Erreur lors de la communication avec le serveur'
        }
      ]
    } as ApiResponseType
  }
}

const criteriasService = { getCriterias }
export { criteriasService }