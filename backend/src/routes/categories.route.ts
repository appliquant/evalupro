import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { requireRole } from '../middlewares/requireRole'
import { createCategory, getCategories, updateCategory } from '../controllers/categories.controller'
import { UserRoles } from '../types'

const categoriesRoute = express.Router()

categoriesRoute.get('/', requireIsSignedin, getCategories)
categoriesRoute.post('/', requireIsSignedin, requireRole(UserRoles.ADMIN), createCategory)
categoriesRoute.put('/:id', requireIsSignedin, requireRole(UserRoles.ADMIN), updateCategory)

export { categoriesRoute }