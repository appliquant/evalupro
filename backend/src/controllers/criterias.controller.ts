import express from 'express'
import { Criteria } from '../db'
import { ApiResponseType } from '../types'

const getCriterias = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Trouver les critères
    const criterias = await Criteria.findAll()

    // 2. Retourner les critères
    const response: ApiResponseType = {
      status: 200,
      message: 'Critères trouvés',
      data: criterias
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

export { getCriterias }