import express from 'express'
import { ApiResponseType } from '../types'
import { Product } from '../db'

const getProducts = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Trouver tous les produits
    const products = await Product.findAll()

    // 2. Retourner les produits
    const successResponse: ApiResponseType = {
      status: 200,
      message: 'Produits trouvés',
      data: { products }
    }

    return res.status(successResponse.status).json(successResponse)
  } catch (error) {
    next(error)
  }
}

export { getProducts }