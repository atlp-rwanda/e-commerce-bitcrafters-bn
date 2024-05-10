import Router from 'express'
import UserController from '../controllers/UserController'
import userSchema, { profileValidationalSchema } from '../validations/userValidation'
import validateRequest from '../utils/validateRequest'
import { singleFileUpload } from '../middlewares/fileUpload'
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
router.get(
  '/profile',isAuthenticated, UserController.getUser)

router.patch(
  '/profile',isAuthenticated, singleFileUpload,
  validateRequest(profileValidationalSchema, 'body'),
  UserController.updateUser
)

router.post(
  '/changeRole/:userId',
  isAuthenticated,
  checkPermission(UserRole.ADMIN),
  UserController.changeUserRole,
)

export default router
