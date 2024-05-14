import type { ApiResponseType } from '@/types'
import { handleApiResponse } from '@/services/handleApiResponse'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const getFavorites = async (jwt: string): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/favorites`, {
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
      message: 'Impossible d\'attendre le serveur lors de la récupération des favoris',
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

const addFavorite = async (jwt: string, productId: string): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify({ productId })
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: 'Impossible d\'attendre le serveur lors de l\'ajout du favori',
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

const favoritesService = { getFavorites, addFavorite }
export { favoritesService }