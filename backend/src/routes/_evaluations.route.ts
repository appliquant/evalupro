import express from 'express'
import { requireIsSignedin } from '../middlewares/requireIsSignedin'
import { requireRole } from '../middlewares/requireRole'
import { UserRoles } from '../types'
import {
  createEvaluation,
  deleteMyEvaluationTester,
  getMyEvaluationsTester,
  updateMyEvaluationsTester
} from '../controllers/_evaluations.controller'

const _evaluationsRoute = express.Router()

_evaluationsRoute.get('/tester', requireIsSignedin, requireRole(UserRoles.TESTER, UserRoles.ADMIN), getMyEvaluationsTester)
_evaluationsRoute.post('/tester/:productId', requireIsSignedin, requireRole(UserRoles.TESTER), createEvaluation)
_evaluationsRoute.put('/tester/:evaluationId', requireIsSignedin, requireRole(UserRoles.TESTER), updateMyEvaluationsTester)
_evaluationsRoute.delete('/tester/:evaluationId', requireIsSignedin, requireRole(UserRoles.TESTER), deleteMyEvaluationTester)

// for admin, don't use /tester

export { _evaluationsRoute }