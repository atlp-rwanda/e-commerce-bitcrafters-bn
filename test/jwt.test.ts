import { expect } from 'chai'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { generateToken, decodeToken } from '../src/utils/jwt'
import { JWT_SECRET } from '../src/config'

describe('generateToken function', () =>
  new Promise<void>((resolve) => {
    it('should generate a JWT token', () => {
      const data = { userId: 123, email: 'example@example.com' }
      const token = generateToken(data)
      expect(token).to.be.a('string')
      resolve()
    })
  }))

it('should generate a JWT token with correct data', () =>
  new Promise<void>((resolve) => {
    const data = { userId: 123, email: 'example@example.com' }
    const token = generateToken(data)
    const decoded = jwt.verify(token, JWT_SECRET)
    expect(decoded).to.be.a('object')
    resolve()
  }))

it('should generate a JWT token with default expiration time if JWT_EXPIRE_TIME is not provided', () =>
  new Promise<void>((resolve) => {
    const data = { userId: 123, email: 'example@example.com' }
    const token = generateToken(data)
    expect(token).to.be.a('string')
    resolve()
  }))

it('should generate a JWT token with custom expiration time if JWT_EXPIRE_TIME is provided', () =>
  new Promise<void>((resolve) => {
    process.env.JWT_EXPIRE_TIME = '3600'
    const data = { userId: 123, email: 'example@example.com' }
    const token = generateToken(data)
    const decoded: object | string = jwt.decode(token)
    expect(decoded).to.be.a('object')
    resolve()
  }))

it('should use default secret when JWT_SECRET is not provided', () =>
  new Promise<void>((resolve) => {
    delete process.env.JWT_SECRET
    const data = { userId: 123, email: 'example@example.com' }
    const token = generateToken(data)
    const decoded = jwt.verify(token, JWT_SECRET)
    expect(decoded).to.be.a('object')
    resolve()
  }))

it('should generate a JWT token with default expiration time if JWT_EXPIRE_TIME is not provided', () => {
  const data = { userId: 123, email: 'example@example.com' }
  const token = generateToken(data)
  const decoded: string | JwtPayload = jwt.decode(token)
  expect(decoded).to.be.a('object')
})

it('should generate a JWT token with custom expiration time if JWT_EXPIRE_TIME is provided', () => {
  process.env.JWT_EXPIRE_TIME = '3600'
  const data = { userId: 123, email: 'example@example.com' }
  const token = generateToken(data)
  const decoded: string | JwtPayload = jwt.decode(token)
  expect(decoded).to.be.a('object')
  delete process.env.JWT_EXPIRE_TIME
})

after(() => {
  delete process.env.JWT_EXPIRE_TIME
  delete process.env.JWT_SECRET
})

describe('Decode Token Tests', () => {
  it('should decode a JWT token', () => {
    const data = { userId: 123, email: 'example@example.com' }
    const token = generateToken(data)
    const decodedData = decodeToken(token)

    expect(decodedData).to.be.a('object')
    expect(decodedData).to.have.property('userId').equal(123)
    expect(decodedData).to.have.property('email').equal('example@example.com')
  })

  it('should generate a JWT token with correct data', () =>
    new Promise<void>((resolve) => {
      const data = { userId: 123, email: 'example@example.com' }
      const token = generateToken(data)
      const decodedData = decodeToken(token)
      expect(decodedData).to.be.a('object')
      expect(decodedData).to.have.property('userId').equal(123)
      expect(decodedData).to.have.property('email').equal('example@example.com')
      resolve()
    }))

  it('should decode JWT token with default expiration time if JWT_EXPIRE_TIME is not provided', () =>
    new Promise<void>((resolve) => {
      const data = { userId: 123, email: 'example@example.com' }
      const token = generateToken(data)
      const decodedData = decodeToken(token)

      expect(decodedData).to.be.a('object')
      expect(decodedData).to.have.property('userId').equal(123)
      expect(decodedData).to.have.property('email').equal('example@example.com')
      resolve()
    }))

  it('should generate a JWT token with custom expiration time if JWT_EXPIRE_TIME is provided', () =>
    new Promise<void>((resolve) => {
      process.env.JWT_EXPIRE_TIME = '3600'
      const data = { userId: 123, email: 'example@example.com' }
      const token = generateToken(data)
      const decodedData = decodeToken(token)

      expect(decodedData).to.be.a('object')
      expect(decodedData).to.have.property('userId').equal(123)
      expect(decodedData).to.have.property('email').equal('example@example.com')
      resolve()
    }))

  it('should use default secret when JWT_SECRET is not provided', () =>
    new Promise<void>((resolve) => {
      delete process.env.JWT_SECRET
      const data = { userId: 123, email: 'example@example.com' }
      const token = generateToken(data)
      const decodedData = decodeToken(token)

      expect(decodedData).to.be.a('object')
      expect(decodedData).to.have.property('userId').equal(123)
      expect(decodedData).to.have.property('email').equal('example@example.com')
      resolve()
    }))

  it('should use custom secret when JWT_SECRET is provided', () =>
    new Promise<void>((resolve) => {
      process.env.JWT_SECRET = 'CUSTOM-SECRET'
      const data = { userId: 123, email: 'example@example.com' }
      const token = generateToken(data)
      const decodedData = decodeToken(token)

      expect(decodedData).to.be.a('object')
      expect(decodedData).to.have.property('userId').equal(123)
      expect(decodedData).to.have.property('email').equal('example@example.com')
      resolve()
    }))

  it('should generate a JWT token with default expiration time if JWT_EXPIRE_TIME is not provided', () => {
    const data = { userId: 123, email: 'example@example.com' }
    const token = generateToken(data)
    const decodedData = decodeToken(token)

    expect(decodedData).to.be.a('object')
    expect(decodedData).to.have.property('userId').equal(123)
    expect(decodedData).to.have.property('email').equal('example@example.com')
  })

  it('should generate a JWT token with custom expiration time if JWT_EXPIRE_TIME is provided', () => {
    process.env.JWT_EXPIRE_TIME = '3600'
    const data = { userId: 123, email: 'example@example.com' }
    const token = generateToken(data)
    const decodedData = decodeToken(token)

    expect(decodedData).to.be.a('object')
    expect(decodedData).to.have.property('userId').equal(123)
    expect(decodedData).to.have.property('email').equal('example@example.com')
    delete process.env.JWT_EXPIRE_TIME
  })
  after(() => {
    delete process.env.JWT_EXPIRE_TIME
    delete process.env.JWT_SECRET
  })
})
