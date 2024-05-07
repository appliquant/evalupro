import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { createProduct, getProducts, updateProduct } from '../controllers/products.controller'
import { requireRole } from '../middlewares/requireRole'
import { UserRoles } from '../types'

const productsRoute = express.Router()

productsRoute.get('/', requireIsSignedin, getProducts)
productsRoute.post('/', requireIsSignedin, requireRole(UserRoles.ADMIN), createProduct)
productsRoute.put('/:id', requireIsSignedin, requireRole(UserRoles.ADMIN), updateProduct)

export { productsRoute }