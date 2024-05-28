import { Router } from 'express'
import notificationController from '../controllers/NotificationController'
import isAuthenticated from '../middlewares/authenticationMiddleware'

const router = Router()
router.get('/', isAuthenticated, notificationController.getNotifications)

export default router
