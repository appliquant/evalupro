import type { ApiResponseType, Criteria } from '@/types'
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

const createCriteria = async (jwt: string, newCriteria: object): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/criterias`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCriteria)
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: 'Impossible d\'attendre le serveur lors de la création du critère',
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

const updateCriteria = async (jwt: string, updatedCriteria: Criteria): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/criterias/${updatedCriteria.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedCriteria)
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: 'Impossible d\'attendre le serveur lors de la mise à jour du critère',
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

const criteriasService = { getCriterias, createCriteria, updateCriteria }
export { criteriasService }