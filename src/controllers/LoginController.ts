import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../database/models/userModel'
import loginSchema from '../validations/userLogin' // Import the login validation schema

/**
 * Function to generate JWT token.
 * @param {number} userId - The user ID to include in the token payload
 * @returns {string} JWT token
 */
function generateToken(userId: number): string {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET)
  return token
}
/**
 * Controller class for managing user-related operations.
 */
export default class LoginController {
  /**
   * Handles user login.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async login(req: Request, res: Response): Promise<Response> {
    // Validate request body against login schema
    const { error } = loginSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    const { email, password } = req.body

    const existingUser = await User.findOne({ where: { email } })
    if (!existingUser) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    )
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(existingUser.id)
    return res.status(200).json({ jwt: token, message: 'Login successful' })
  }
}
