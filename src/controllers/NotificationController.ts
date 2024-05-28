import { Request, Response } from 'express'
import Notification from '../database/models/notificationModel'
/**
 * Controller class for managing notifications-related operations ..
 */
class NotificationController {
  /**
   * Get notifications for the authenticated user
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async getNotifications(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const userId = req.user.id
      const notifications = await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
      })

      return res.status(200).json({ data: notifications })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default NotificationController
