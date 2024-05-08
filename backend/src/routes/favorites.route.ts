import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { getFavorites } from '../controllers/favorites.controller'

const favoritesRoute = express.Router()

favoritesRoute.get('/favorites', requireIsSignedin, getFavorites)

export { favoritesRoute }