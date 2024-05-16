import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { requireRole } from '../middlewares/requireRole'
import { UserRoles } from '../types'
import {
  createEvaluation,
  getMyEvaluationsTester,
  updateMyEvaluationsTester
} from '../controllers/evaluations.controller'

const evaluationsRoute = express.Router()

// Deux GET
// 1. Admin :
//    GET / : Récupérer toutes les évaluations
// 2. Testeur :
//    GET /me : Récupérer ses évaluations

evaluationsRoute.get('/me', requireIsSignedin, requireRole(UserRoles.TESTER), getMyEvaluationsTester)
evaluationsRoute.post('/:productId', requireIsSignedin, requireRole(UserRoles.TESTER), createEvaluation)
evaluationsRoute.put('/me/:evaluationId', requireIsSignedin, requireRole(UserRoles.TESTER), updateMyEvaluationsTester)

export { evaluationsRoute }