import type { ApiResponseType } from '@/types'
import { handleApiResponse } from '@/services/handleApiResponse'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

async function signup(username: string, email: string, password: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: `Impossible d'atteindre le serveur lors de la création de compte : ${e}`,
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

async function signin(email: string, password: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: `Impossible d'atteindre le serveur lors de la connexion: ${e}`,
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

const authService = {
  signup,
  signin
}

export { authService }
