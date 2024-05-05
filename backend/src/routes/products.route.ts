import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { getProducts } from '../controllers/products.controller'

const productsRoute = express.Router()

productsRoute.get('/', requireIsSignedin, getProducts)

export { productsRoute }