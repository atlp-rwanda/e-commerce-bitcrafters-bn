import Router from 'express'
import UserController from '../controllers/UserController'
import userSchema, {
  profileValidationalSchema,
  otpSchema,
} from '../validations/userValidation'
import validateRequest from '../utils/validateRequest'
import { singleFileUpload } from '../middlewares/fileUpload'
import isAuthenticated, {
  checkPermission,
} from '../middlewares/authenticationMiddleware'
import { UserRole } from '../database/models/userModel'
import paramSchema from '../validations/paramValidation'
import LoginController from '../controllers/LoginController'

const router = Router()

router.post(
  '/signup',
  validateRequest(userSchema, 'body'),
  UserController.signup,
)
router.get('/profile', isAuthenticated, UserController.getUser)

router.patch(
  '/profile',
  isAuthenticated,
  singleFileUpload,
  validateRequest(profileValidationalSchema, 'body'),
  UserController.updateUser,
)

router.post(
  '/changeRole/:userId',
  isAuthenticated,
  checkPermission(UserRole.ADMIN),
  UserController.changeUserRole,
)
router.post('/logout',isAuthenticated, LoginController.logOut)

router.post(
  '/changeRole/:userId',
  isAuthenticated,
  checkPermission(UserRole.ADMIN),
  UserController.changeUserRole,
)
router.post(
  '/login/verify/otp/:email',
  validateRequest(otpSchema, 'body'),
  UserController.twofaVerifyOtp,
)
router.get(
  '/verify/:token',
  validateRequest(paramSchema, 'params'),
  UserController.verifyEmail,
)

export default router
