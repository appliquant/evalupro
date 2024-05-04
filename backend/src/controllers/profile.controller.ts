import express from 'express'
import { User } from '../db'
import { ApiResponseType } from '../types'

const getProfile = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.jwtToken?.email
      }
    })
    if (!user) {
      const userNotFoundError = {
        status: 404,
        message: 'Utilisateur non trouvé'
      }

      return res.status(userNotFoundError.status).json(userNotFoundError)
    }

    const response: ApiResponseType = {
      status: 200,
      message: 'Utilisateur trouvé',
      data: {
        role: user.dataValues.role
      }
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

export { getProfile }