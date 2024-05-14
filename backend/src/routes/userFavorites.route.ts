import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import {
  addUserFavorite,
  checkIfProductIsFavorite,
  deleteUserFavorite,
  getUserFavorites
} from '../controllers/userFavorites.controller'

const userFavoritesRoute = express.Router()

userFavoritesRoute.get('/', requireIsSignedin, getUserFavorites)
userFavoritesRoute.get('/:productId', requireIsSignedin, checkIfProductIsFavorite)
userFavoritesRoute.post('/', requireIsSignedin, addUserFavorite)
userFavoritesRoute.delete('/:productId', requireIsSignedin, deleteUserFavorite)


export { userFavoritesRoute }