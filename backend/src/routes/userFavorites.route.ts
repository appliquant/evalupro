import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { addUserFavorite, getUserFavorites } from '../controllers/userFavorites.controller'

const userFavoritesRoute = express.Router()

userFavoritesRoute.get('/', requireIsSignedin, getUserFavorites)
userFavoritesRoute.post('/', requireIsSignedin, addUserFavorite)

export { userFavoritesRoute }