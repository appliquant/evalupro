import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { requireRole } from '../middlewares/requireRole'
import { UserRoles } from '../types'
import { getCriterias } from '../controllers/criterias.controller'

const criteriasRoute = express.Router()

criteriasRoute.get('/', requireIsSignedin, requireRole(UserRoles.ADMIN), getCriterias)

export { criteriasRoute }