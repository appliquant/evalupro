import express from 'express'
import { Favorite, User } from '../db'
import { ApiResponseType } from '../types'

const getUserFavorites = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id: userId } = req.params

    // 1. Récupérer les favoris de l'utilisateur
    // const favorites = await User.findByPk(userId, {
    //   include: 'favorites'
    // })
    const favorites = await Favorite.findOne({
      where: {
        userId: userId
      }
    })
    if (!favorites) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Utilisateur non trouvé'
      }
      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    console.log(favorites.dataValues)

    // 2. Répondre 
    const response: ApiResponseType = {
      status: 200,
      message: 'Favoris récupérés',
      data: favorites.dataValues.favorites
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

export { getUserFavorites }