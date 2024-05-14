import { Request, Response,NextFunction } from 'express'
import User,{UserAttributes} from '../database/models/userModel'
import { generateToken } from '../utils/jwt'
import { createUserProfile } from '../services/userServices'

import { comparePassword } from '../utils/passwords'
import otpEmailTemplate from '../utils/otpEmailTemplate'
import redisClient from '../utils/redisConfiguration'
import sendMail from '../utils/sendEmail'
import passport from '../config/passport'
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
    const { email, password } = req.body
    const existingUser = await User.findOne({ where: { email } })
    if (!existingUser) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    if (existingUser.verified !== true) {
      return res
        .status(401)
        .json({ message: 'Check your email and verify your account' })
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password,
    )
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    createUserProfile(existingUser.id)

    const tokenPayload: {
      id: number
      userRole: string
      email: string
      otp?: string
    } = {
      id: existingUser.id,
      userRole: existingUser.userRole,
      email: existingUser.email,
    }

    if (existingUser.userRole === 'seller') {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`
      const html = otpEmailTemplate(existingUser.username, otp)
      const otptoken = generateToken({
        id: existingUser.id,
        email: existingUser.email,
        otp,
      })
      await redisClient
        .setEx(existingUser.email, 300, `${otp}=${otptoken}`)
        .then(async () => {
          await sendMail(email, 'OTP VERIFICATION CODE', html)
        })

      tokenPayload.otp = otp
      const sellerTokenMessage =
        'Email sent to your email. Please check your inbox messages and enter the OTP for verification'
      return res.status(200).json({ message: sellerTokenMessage })
    }

    const token = generateToken(tokenPayload)
    return res
      .status(200)
      .header('authorization', token)
      .json({ jwt: token, message: 'Login successful' })
  }

  /** 
   * Login method via google
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   * @returns {void}
   */
  static loginWithGoogle(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    passport.authenticate(
      'google',
      (err: unknown, user: UserAttributes | null) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' })
        }
        if (!user) {
          return res.status(401).json({ error: 'Authentication failed' })
        }
        const plainUser = { ...user }
        const token = generateToken(plainUser)
        res.status(200).json({ token })
        // res.redirect(`${FRONTEND_URL}/google?token=${token}`)
      },
    )(req, res, next)
  }
}
