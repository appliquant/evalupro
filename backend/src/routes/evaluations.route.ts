import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { requireRole } from '../middlewares/requireRole'
import { UserRoles } from '../types'
import {
  createEvaluation,
  deleteEvaluations,
  getEvaluations,
  updateEvaluations
} from '../controllers/evaluations.controller'

const evaluationsRoute = express.Router()

evaluationsRoute.get('/tester', requireIsSignedin, requireRole(UserRoles.TESTER, UserRoles.ADMIN), getEvaluations)
evaluationsRoute.post('/tester/:productId', requireIsSignedin, requireRole(UserRoles.TESTER), createEvaluation)
evaluationsRoute.put('/tester/:evaluationId', requireIsSignedin, requireRole(UserRoles.TESTER), updateEvaluations)
evaluationsRoute.delete('/tester/:evaluationId', requireIsSignedin, requireRole(UserRoles.TESTER), deleteEvaluations)

evaluationsRoute.get('/', requireIsSignedin, requireRole(UserRoles.ADMIN), getEvaluations)
evaluationsRoute.put('/:evaluationId', requireIsSignedin, requireRole(UserRoles.ADMIN), updateEvaluations)
evaluationsRoute.delete('/:evaluationId', requireIsSignedin, requireRole(UserRoles.ADMIN), deleteEvaluations)

export { evaluationsRoute }
