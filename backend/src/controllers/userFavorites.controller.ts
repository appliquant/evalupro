import express from 'express'
import { Favorite, User } from '../db'
import { ApiResponseType } from '../types'

const getUserFavorites = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Récupérer les favoris de l'utilisateur
    const favorites = await Favorite.findOne({
      where: {
        email: req.jwtToken?.email
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

const addUserFavorite = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Récupérer les données
    const { productId } = req.body

    // 2. Vérifier les données
    if (!productId) {
      const missingFieldsResponse: ApiResponseType = {
        status: 400,
        message: 'Champ manquant',
        errors: [
          {
            field: 'productId',
            message: 'Le produit est manquant'
          }
        ]
      }

      return res.status(missingFieldsResponse.status).json(missingFieldsResponse)
    }

    // 3. Récupérer l'utilisateur
    const user = await User.findOne({
      where: {
        email: req.jwtToken?.email
      }
    })

    if (!user) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Utilisateur non trouvé'
      }
      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    // 4. Vérifier si ce produit est déjà un favori
    const favorite = await Favorite.findOne({
      where: {
        userId: user.dataValues.id,
        productId
      }
    })

    // Si existe, ne rien faire
    // Sinon, ajouter le favori
    if (!favorite) {
      await Favorite.create({
        userId: user.dataValues.id,
        productId
      })
    }

    // 5. Répondre
    const response: ApiResponseType = {
      status: 200,
      message: 'Favori ajouté'
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const checkIfProductIsFavorite = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Récupérer les données
    const { productId } = req.params

    if (!productId) {
      const missingFieldsResponse: ApiResponseType = {
        status: 400,
        message: 'Champ manquant',
        errors: [
          {
            field: 'productId',
            message: 'Le produit est manquant'
          }
        ]
      }

      return res.status(missingFieldsResponse.status).json(missingFieldsResponse)
    }

    // 2. Récupérer l'utilisateur
    const user = await User.findOne({
      where: {
        email: req.jwtToken?.email
      }
    })

    if (!user) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Utilisateur non trouvé'
      }
      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    // 3. Vérifier si ce produit est déjà un favori
    const favorite = await Favorite.findOne({
      where: {
        userId: user.dataValues.id,
        productId
      }
    })

    const isFavorite = favorite !== null

    // 5. Répondre
    const response: ApiResponseType = {
      status: 200,
      message: 'Favori ajouté',
      data: {
        isFavorite
      }
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

const deleteUserFavorite = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 1. Récupérer les données
    const { productId } = req.params

    if (!productId) {
      const missingFieldsResponse: ApiResponseType = {
        status: 400,
        message: 'Champ manquant',
        errors: [
          {
            field: 'productId',
            message: 'Le produit est manquant'
          }
        ]
      }

      return res.status(missingFieldsResponse.status).json(missingFieldsResponse)
    }

    // 3. Récupérer l'utilisateur
    const user = await User.findOne({
      where: {
        email: req.jwtToken?.email
      }
    })

    if (!user) {
      const notFoundResponse: ApiResponseType = {
        status: 404,
        message: 'Utilisateur non trouvé'
      }
      return res.status(notFoundResponse.status).json(notFoundResponse)
    }

    // 4. Vérifier si ce produit est déjà un favori
    const favorite = await Favorite.findOne({
      where: {
        userId: user.dataValues.id,
        productId
      }
    })

    // 5. Supprimer le favori 
    if (favorite) {
      await favorite.destroy()
    }

    // 6. Répondre
    const response: ApiResponseType = {
      status: 200,
      message: 'Favori supprimé'
    }

    return res.status(response.status).json(response)
  } catch (err) {
    next(err)
  }
}

export { getUserFavorites, addUserFavorite, checkIfProductIsFavorite, deleteUserFavorite }