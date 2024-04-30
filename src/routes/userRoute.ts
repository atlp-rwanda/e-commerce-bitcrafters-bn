import Router from 'express'
import UserController from '../controllers/UserController'
import userSchema from '../validations/userValidation'
import validateRequest from '../utils/validateRequest'
import isAuthenticated, {
  checkPermission,
} from '../middlewares/authenticationMiddleware'
import { UserRole } from '../database/models/userModel'

const router = Router()

router.post(
  '/signup',
  validateRequest(userSchema, 'body'),
  UserController.signup,
)

router.post(
  '/changeRole/:userId',
  isAuthenticated,
  checkPermission(UserRole.ADMIN),
  UserController.changeUserRole,
)

export default router
