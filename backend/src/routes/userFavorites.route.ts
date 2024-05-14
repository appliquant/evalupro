import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { addUserFavorite, checkIfProductIsFavorite, getUserFavorites } from '../controllers/userFavorites.controller'

const userFavoritesRoute = express.Router()

userFavoritesRoute.get('/', requireIsSignedin, getUserFavorites)
userFavoritesRoute.get('/:productId', requireIsSignedin, checkIfProductIsFavorite)
userFavoritesRoute.post('/', requireIsSignedin, addUserFavorite)


export { userFavoritesRoute }