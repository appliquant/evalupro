import type { ApiResponseType } from '@/types'
import { handleApiResponse } from '@/services/handleApiResponse'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const getProducts = async (jwt: string): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products`, {
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
      message: 'Impossible d\'attendre le serveur lors de la récupérations des produits',
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

const createProduct = async (jwt: string, newProduct: FormData): Promise<ApiResponseType> => {
  try {

    const res = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`
        // Ne PAS spécifier Content-Type pour les uploads de fichiers
      },
      body: newProduct
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: 'Impossible d\'attendre le serveur lors d\'ajout de produits',
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


const productsService = { getProducts, createProduct }
export { productsService }