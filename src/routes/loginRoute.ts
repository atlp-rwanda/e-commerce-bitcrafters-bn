import Router from 'express'

import LoginController from '../controllers/LoginController'
import loginSchema from '../validations/userLogin'
import validateRequest from '../utils/validateRequest'

const router = Router()
router.post(
  '/login',
  validateRequest(loginSchema, 'body'),
  LoginController.login,
)

export default router
