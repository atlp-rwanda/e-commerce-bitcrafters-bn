import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../database/models/userModel'
/**
 * User Controller class
 */
export default class UserController {
  /**
   * Signup method for user registration
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async signup(req: Request, res: Response): Promise<Response> {
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(req.body.password, salt)

    const { email } = req.body
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({
        message: 'This user already exists',
      })
    }
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedpassword,
    })

    await newUser.save()
    return res.status(201).json({
      message: 'Account Created successfully',
    })
  }
}
