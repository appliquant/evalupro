import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { requireRole } from '../middlewares/requireRole'
import { UserRoles } from '../types'
import { createEvaluation, getMyEvaluationsTester } from '../controllers/evaluations.controller'

const evaluationsRoute = express.Router()

// Deux GET
// 1. Admin :
//    GET / : Récupérer toutes les évaluations
// 2. Testeur :
//    GET /me : Récupérer ses évaluations

evaluationsRoute.get('/me', requireIsSignedin, requireRole(UserRoles.TESTER), getMyEvaluationsTester)
evaluationsRoute.post('/:productId', requireIsSignedin, requireRole(UserRoles.TESTER), createEvaluation)

export { evaluationsRoute }