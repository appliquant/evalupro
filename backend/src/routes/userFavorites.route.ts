import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { getUserFavorites } from '../controllers/userFavorites.controller'

const userFavoritesRoute = express.Router()

userFavoritesRoute.get('/:id', requireIsSignedin, getUserFavorites)

export { userFavoritesRoute }