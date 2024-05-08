import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { requireRole } from '../middlewares/requireRole'
import { UserRoles } from '../types'
import { createCriteria, getCriterias } from '../controllers/criterias.controller'

const criteriasRoute = express.Router()

criteriasRoute.get('/', requireIsSignedin, requireRole(UserRoles.ADMIN), getCriterias)
criteriasRoute.post('/', requireIsSignedin, requireRole(UserRoles.ADMIN), createCriteria)

export { criteriasRoute }