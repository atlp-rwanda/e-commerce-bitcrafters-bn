/* eslint-disable @typescript-eslint/no-namespace */
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRE_TIME } from '../config'
const generateToken = (data: object) => {
  const token = jwt.sign(data, JWT_SECRET, {
    expiresIn: JWT_EXPIRE_TIME,
  })
  return token
}

export default generateToken
