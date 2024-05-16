// import type { ApiResponseType } from '@/types'
// import { handleApiResponse } from '@/services/handleApiResponse'
//
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
//
// const createMyEvaluationsTester = async (jwt: string, productId: string, data: object): Promise<ApiResponseType> => {
//   try {
//     const res = await fetch(`${BACKEND_URL}/api/evaluations/tester/${productId}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${jwt}`
//       },
//       body: JSON.stringify(data)
//     })
//
//     return await handleApiResponse(res)
//   } catch (e) {
//     return {
//       status: 500,
//       message: 'Impossible d\'attendre le serveur lors de la création de l\'évaluation',
//       errors: [
//         {
//           field: 'network',
//           message:
//             e instanceof Error ? e.message : 'Erreur lors de la communication avec le serveur'
//         }
//       ]
//     } as ApiResponseType
//   }
// }
//
// const getMyEvaluationsTester = async (jwt: string): Promise<ApiResponseType> => {
//   try {
//     const res = await fetch(`${BACKEND_URL}/api/evaluations/tester`, {
//       headers: {
//         Authorization: `Bearer ${jwt}`
//       }
//     })
//
//     return await handleApiResponse(res)
//   } catch (e) {
//     return {
//       status: 500,
//       message: 'Impossible d\'attendre le serveur lors de la récupération des évaluations',
//       errors: [
//         {
//           field: 'network',
//           message:
//             e instanceof Error ? e.message : 'Erreur lors de la communication avec le serveur'
//         }
//       ]
//     } as ApiResponseType
//   }
// }
//
// const updateMyEvaluationTester = async (jwt: string, evaluationId: string, data: object): Promise<ApiResponseType> => {
//   try {
//     const res = await fetch(`${BACKEND_URL}/api/evaluations/tester/${evaluationId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${jwt}`
//       },
//       body: JSON.stringify(data)
//     })
//
//     return await handleApiResponse(res)
//   } catch (e) {
//     return {
//       status: 500,
//       message: 'Impossible d\'attendre le serveur lors de la mise à jour de l\'évaluation',
//       errors: [
//         {
//           field: 'network',
//           message:
//             e instanceof Error ? e.message : 'Erreur lors de la communication avec le serveur'
//         }
//       ]
//     } as ApiResponseType
//   }
// }
//
// const deleteMyEvaluationTester = async (jwt: string, evaluationId: string): Promise<ApiResponseType> => {
//   try {
//     const res = await fetch(`${BACKEND_URL}/api/evaluations/tester/${evaluationId}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${jwt}`
//       }
//     })
//
//     return await handleApiResponse(res)
//   } catch (e) {
//     return {
//       status: 500,
//       message: 'Impossible d\'attendre le serveur lors de la suppression de l\'évaluation',
//       errors: [
//         {
//           field: 'network',
//           message:
//             e instanceof Error ? e.message : 'Erreur lors de la communication avec le serveur'
//         }
//       ]
//     } as ApiResponseType
//   }
// }
//
// const getEvaluations = async (jwt: string): Promise<ApiResponseType> => {
//   try {
//     const res = await fetch(`${BACKEND_URL}/api/evaluations`, {
//       headers: {
//         Authorization: `Bearer ${jwt}`
//       }
//     })
//    
//     return await handleApiResponse(res)
//   }
//   catch (e) {
//     return {
//       status: 500,
//       message: 'Impossible d\'attendre le serveur lors de la récupération des évaluations',
//       errors: [
//         {
//           field: 'network',
//           message:
//             e instanceof Error ? e.message : 'Erreur lors de la communication avec le serveur'
//         }
//       ]
//     } as ApiResponseType
//   }
// }
//
// const evaluationsService = {
//   createMyEvaluationsTester,
//   getMyEvaluationsTester,
//   updateMyEvaluationTester,
//   deleteMyEvaluationTester
// }
// export { evaluationsService }

import type { ApiResponseType } from '@/types'
import { handleApiResponse } from '@/services/handleApiResponse'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const createMyEvaluationsTester = async (jwt: string, productId: string, data: object): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/evaluations/tester/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify(data)
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: 'Impossible d\'attendre le serveur lors de la création de l\'évaluation',
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

const getMyEvaluationsTester = async (jwt: string): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/evaluations/tester`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: 'Impossible d\'attendre le serveur lors de la récupération des évaluations',
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

const updateMyEvaluationTester = async (jwt: string, evaluationId: string, data: object): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/evaluations/tester/${evaluationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify(data)
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: 'Impossible d\'attendre le serveur lors de la mise à jour de l\'évaluation',
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

const deleteMyEvaluationTester = async (jwt: string, evaluationId: string): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/evaluations/tester/${evaluationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: 'Impossible d\'attendre le serveur lors de la suppression de l\'évaluation',
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

const getEvaluations = async (jwt: string): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/evaluations`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: 'Impossible d\'attendre le serveur lors de la récupération des évaluations',
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

const updateEvaluation = async (jwt: string, evaluationId: string, data: object): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/evaluations/${evaluationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify(data)
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: 'Impossible d\'attendre le serveur lors de la mise à jour de l\'évaluation',
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

const deleteEvaluation = async (jwt: string, evaluationId: string): Promise<ApiResponseType> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/evaluations/${evaluationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    return await handleApiResponse(res)
  } catch (e) {
    return {
      status: 500,
      message: 'Impossible d\'attendre le serveur lors de la suppression de l\'évaluation',
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

const evaluationsService = {
  createMyEvaluationsTester,
  getMyEvaluationsTester,
  updateMyEvaluationTester,
  deleteMyEvaluationTester,
  getEvaluations,
  updateEvaluation,
  deleteEvaluation
}

export { evaluationsService }
