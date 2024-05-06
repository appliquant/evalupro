import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { createProduct, getProducts } from '../controllers/products.controller'
import { requireRole } from '../middlewares/requireRole'
import { UserRoles } from '../types'

const productsRoute = express.Router()

productsRoute.get('/', requireIsSignedin, getProducts)
productsRoute.post('/', requireIsSignedin, requireRole(UserRoles.ADMIN), createProduct)

export { productsRoute }