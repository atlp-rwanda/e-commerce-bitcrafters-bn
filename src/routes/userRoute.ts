import Router from 'express'

import UserController from '../controllers/UserController'
import userSchema from '../validations/userValidation'
import validateRequest from '../utils/validateRequest'
const router = Router()
router.post(
  '/signup',
  validateRequest(userSchema, 'body'),
  UserController.signup,
)

export default router
