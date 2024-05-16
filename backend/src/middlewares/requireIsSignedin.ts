import express from 'express'
import * as jose from 'jose'
import { ApiResponseType } from '../types'
import { User } from '../db'

export async function requireIsSignedin(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const token = req.headers['authorization']?.split(' ')[1]
    if (!token) {
      const missingTokenError: ApiResponseType = {
        status: 401,
        message: 'Bearer token manquant'
      }

      return res.status(missingTokenError.status).json(missingTokenError)
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const jwt = await jose.jwtVerify(token, secret)

    const user = await User.findOne({
      where: {
        email: jwt.payload.email
      }
    })

    if (!user) {
      const userNotFoundError: ApiResponseType = {
        status: 404,
        message: 'Utilisateur non trouvé'
      }

      return res.status(userNotFoundError.status).json(userNotFoundError)
    }

    req.jwtToken = {
      email: jwt.payload.email as string,
      userId: user.dataValues.id as string,
    }

    next()
  } catch (err) {
    next(err)
  }
}