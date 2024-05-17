import type { ApiResponseType } from '@/types'
import { handleApiResponse } from '@/services/handleApiResponse'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const getProducts = async (
  jwt: string,
  productNameFilter?: string | null,
  productCategoryFilterId?: string | null,
  productResultSort?: string | null
): Promise<ApiResponseType> => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/products?` +
      new URLSearchParams({
        ...(productNameFilter && { productNameFilter }),
        ...(productCategoryFilterId && { productCategoryFilterId }),
        ...(productResultSort && { productResultSort })
      }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        }
      }
    )

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

const updateProduct = async (jwt: string, updatedProduct: FormData): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/${updatedProduct.get('id')}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`
        // Ne PAS spécifier Content-Type pour les uploads de fichiers
      },
      body: updatedProduct
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: 'Impossible d\'attendre le serveur lors de la mise à jour du produit',
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

const deleteProduct = async (jwt: string, productId: string): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      }
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: 'Impossible d\'attendre le serveur lors de la suppression du produit',
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

const getProduct = async (jwt: string, productId: string): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/${productId}`, {
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
      message: 'Impossible d\'attendre le serveur lors de la récupération du produit',
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

const getTestersComments = async (jwt: string, productId: string): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/${productId}/comments`, {
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
      message: 'Impossible d\'attendre le serveur lors de la récupération des commentaires',
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

const productsService = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getTestersComments }
export { productsService }
