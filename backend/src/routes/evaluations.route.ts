import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { requireRole } from '../middlewares/requireRole'
import { UserRoles } from '../types'
import { createEvaluation } from '../evaluations.controller'

const evaluationsRoute = express.Router()

evaluationsRoute.post('/:productId', requireIsSignedin, requireRole(UserRoles.TESTER), createEvaluation)

export { evaluationsRoute }