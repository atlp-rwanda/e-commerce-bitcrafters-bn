/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from 'chai'
import jwt from 'jsonwebtoken'
import generateToken from '../src/utils/jwt'

describe('generateToken function', () => {
  it('should generate a JWT token', () => {
    const data = { userId: 123, email: 'example@example.com' }
    const token = generateToken(data)
    expect(token).to.be.a('string')
  })
})
