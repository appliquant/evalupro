import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { requireRole } from '../middlewares/requireRole'
import { UserRoles } from '../types'
import {
  createEvaluation, deleteMyEvaluationTester,
  getMyEvaluationsTester,
  updateMyEvaluationsTester
} from '../controllers/evaluations.controller'

const evaluationsRoute = express.Router()

evaluationsRoute.get('/tester', requireIsSignedin, requireRole(UserRoles.TESTER), getMyEvaluationsTester)
evaluationsRoute.post('/tester/:productId', requireIsSignedin, requireRole(UserRoles.TESTER), createEvaluation)
evaluationsRoute.put('/tester/:evaluationId', requireIsSignedin, requireRole(UserRoles.TESTER), updateMyEvaluationsTester)
evaluationsRoute.delete('/tester/:evaluationId', requireIsSignedin, requireRole(UserRoles.TESTER), deleteMyEvaluationTester)

export { evaluationsRoute }