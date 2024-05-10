import { Response, Request, NextFunction } from 'express'
import { decodeToken } from '../utils/jwt'
import { getUserById } from '../services/userServices'
import { UserAttributes } from '../database/models/userModel'

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes
    }
  }
}

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Please Login' })
    }
    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'no access token found' })
    }

    const payload = await decodeToken(token)
    const user = await getUserById(payload.id)
    req.user = user
    res.locals.decoded = user
    next()
  } catch (error) {
    res.status(500).json({ message: 'Internal server down' })
  }
}

export default isAuthenticated
