import { ApiResponseType, UserRoles } from '../types'
import express from 'express'
import { User } from '../db'

// Vérifier à chaque requête si l'utilisateur a le rôle nécessaire
export function requireRole(...requiredRole: UserRoles[]) {
  return async function(req: express.Request, res: express.Response, next: express.NextFunction) {
    {
      try {
        // Email disponible à ce point car le middleware "requireIsSignedin" a été exécuté avant (normalement)
        const email = req.jwtToken?.email
        if (!email) {
          const missingEmailError: ApiResponseType = {
            status: 401,
            message: 'Courriel manquant'
          }

          return res.status(missingEmailError.status).json(missingEmailError)
        }

        const user = await User.findOne({
          where: {
            email
          }
        })

        if (!user) {
          const userNotFoundError: ApiResponseType = {
            status: 404,
            message: 'Utilisateur non trouvé'
          }

          return res.status(userNotFoundError.status).json(userNotFoundError)
        }

        if (!requiredRole.includes(user.dataValues.role)) {
          const unauthorizedError: ApiResponseType = {
            status: 403,
            message: 'Non autorisé'
          }

          return res.status(unauthorizedError.status).json(unauthorizedError)
        }

        next()
      } catch (err) {
        next(err)
      }
    }
  }
}