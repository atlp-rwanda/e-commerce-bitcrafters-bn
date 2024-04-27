import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../database/models/userModel'
import userSchema from '../validations/userValidation'
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
    const { error } = userSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }
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
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET)
    return res.status(201).json({
      jwt: token,
      message: 'Account Created successfully',
    })
  }
}
