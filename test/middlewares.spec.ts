import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import isAuthenticated from '../src/middlewares/authenticationMiddleware'
import { JWT_SECRET, JWT_EXPIRE_TIME } from '../src/config'
import * as userServiceHelpers from '../src/services/userServices'
import * as tokenHelpers from '../src/utils/jwt'
import User from '../src/database/models/userModel'

chai.use(sinonChai)

describe('isAuthenticated function', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let jwtVerifyStub: sinon.SinonStub
  let getUserByIdStub: sinon.SinonStub
  let decodeTokenStub: sinon.SinonStub
  let sandbox: sinon.SinonSandbox

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer validToken',
      },
    } as Request
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      locals: {},
    } as unknown as Response
    next = sinon.spy()
    jwtVerifyStub = sinon.stub(jwt, 'verify')
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sinon.restore()
    jwtVerifyStub.restore()
    sandbox.restore()
  })

  it('should return 401 "Please login" if no token', async () => {
    const data = { id: 1, email: 'test@example.com' }
    const myToken = jwt.sign(data, JWT_SECRET || 'USER-AUTH', {
      expiresIn: JWT_EXPIRE_TIME,
    })
    const mockDecoded = { userId: 1, username: 'testuser' }
    req.headers = {}
    jwtVerifyStub.returns(mockDecoded)

    jwtVerifyStub.callsFake((token, secret, callback) => {
      token = myToken
      const mockDecoded1 = { id: 1, email: 'test@example.com' }
      res.locals.decoded = mockDecoded1
      req.user = mockDecoded1
      callback(null, mockDecoded1)
    })
    await isAuthenticated(req, res, next)

    expect(jwtVerifyStub).to.not.be.calledOnceWith(myToken, JWT_SECRET)
    expect(res.status).to.have.been.calledWith(401)
    expect(next).to.not.be.calledOnce
  })

  it('--1-- should call next() with valid token', async () => {
    const data = { id: 1, email: 'test@example.com' }
    const myToken = jwt.sign(data, JWT_SECRET, {
      expiresIn: JWT_EXPIRE_TIME,
    })
    const mockDecoded = { userId: 1, username: 'testuser' }
    req.headers = { authorization: `Bearer ${myToken}` }
    jwtVerifyStub.returns(mockDecoded)

    jwtVerifyStub.callsFake((token, secret, callback) => {
      token = myToken
      const mockDecoded1 = {
        id: 1,
        email: 'test@example.com',
        userRole: 'admin',
      }
      res.locals.decoded = mockDecoded1
      req.user = mockDecoded1
      callback(null, mockDecoded1)
    })

    decodeTokenStub = sandbox
      .stub(tokenHelpers, 'decodeToken')
      .resolves({ id: 1, email: 'test@example.com' })
    getUserByIdStub = sandbox
      .stub(userServiceHelpers, 'getUserById')
      .resolves({ id: 1, email: 'test@example.com' } as User)
    await isAuthenticated(req, res, next)

    expect(decodeTokenStub).to.have.been.called
    expect(getUserByIdStub).to.have.been.called
    expect(res.locals.decoded).to.have.property('id').equals(1)
    expect(req.user).to.deep.equal(data)
    expect(next).to.be.calledOnce
  })

  it('--2 should call next() with valid token', async () => {
    const mockToken = 'valid.jwt.token'
    const mockDecoded = { userId: 1, username: 'testuser' }
    req.headers = { authorization: `Bearer ${mockToken}` }

    jwtVerifyStub.callsFake((token, secret, callback) =>
      callback(null, mockDecoded),
    )
    decodeTokenStub = sandbox
      .stub(tokenHelpers, 'decodeToken')
      .resolves({ id: 1, email: 'test@example.com' })
    getUserByIdStub = sandbox
      .stub(userServiceHelpers, 'getUserById')
      .resolves({ id: 1, email: 'test@example.com' } as User)

    await isAuthenticated(req, res, next)

    expect(res.locals.decoded).to.have.property('id').equals(1)
    expect(req.user).to.have.property('id').equals(1)
    expect(next).to.be.called
  })

  it('should return 500 Internal Server Error if an unexpected error occurs', async () => {
    const req = {
      headers: {
        authorization: 'Bearer validToken',
      },
    }
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      locals: {},
    }

    jwtVerifyStub.throws(new Error('Invalid token'))
    await isAuthenticated(req as Request, res as unknown as Response, next)

    expect(jwtVerifyStub).to.have.been.calledWith('validToken', JWT_SECRET)
    expect(res.status).to.have.been.calledWith(500)
    expect(res.json).to.have.been.calledWith({
      message: 'Internal server down', error: 'Invalid token'
    })
    expect(next).not.to.have.been.called
  })

  it('should handle missing JWT_SECRET environment variable', () => {
    const req = {
      headers: {
        authorization: 'Bearer <token>',
      },
    }
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    }

    delete process.env.JWT_SECRET

    isAuthenticated(req as Request, res as unknown as Response, next)

    expect(res.status).to.not.have.been.called
    expect(res.json).to.not.have.been.calledOnce
  })

  it('should handle invalid JWT_SECRET environment variable', () => {
    const req = {
      headers: {
        authorization: 'Bearer <token>',
      },
    }
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    }

    process.env.JWT_SECRET = 'invalid-secret'

    isAuthenticated(req as Request, res as unknown as Response, next)

    expect(res.status).to.not.have.been.called
    expect(res.json).to.not.have.been.calledWith({
      message: 'Internal server down',
    })
  })
  it('should return 401 if no authorization header is present', async () => {
    const req: Request = { headers: {} } as Request
    const res: Response = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as unknown as Response

    await isAuthenticated(req, res, next)

    expect(res.status).to.have.been.calledWith(401)
    expect(res.json).to.have.been.calledWith({ message: 'Please Login' })
    expect(next).not.to.have.been.called
  })

  it('should return 401 for empty token', async () => {
    const req: Request = {
      headers: { authorization: 'uu' },
    } as Request
    const res: Response = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as unknown as Response

    await isAuthenticated(req, res, next)

    expect(res.status).to.have.been.calledWith(401)
    expect(res.json).to.have.been.calledWith({
      message: 'no access token found',
    })
    expect(next).not.to.have.been.called
  })

  it('should return 500 for invalid token', async () => {
    const req: Request = {
      headers: { authorization: 'Bearer invalid.token' },
    } as Request
    const res: Response = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as unknown as Response

    jwtVerifyStub.callsFake((token, secret, callback) => {
      callback(new Error('Invalid token'))
    })

    await isAuthenticated(req, res, next)

    expect(jwtVerifyStub).to.have.been.calledOnce
    expect(res.status).to.have.been.calledWith(500)
    expect(res.json).to.have.been.called
    expect(next).not.to.have.been.called

    sandbox.restore()
  })

  it('should extract token from valid authorization header', async () => {
    const req: Request = {
      headers: { authorization: 'Bearer valid_token' },
    } as Request
    const res: Response = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as unknown as Response

    const token = req.headers.authorization?.split(' ')[1]
    await isAuthenticated(req, res, next)

    expect(token).to.be.a('string')
  })

  it('should handle missing authorization header', async () => {
    const req: Request = { headers: {} } as Request
    const res: Response = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as unknown as Response

    await isAuthenticated(req, res, next)

    expect(res.status).to.have.been.calledWith(401)
    expect(res.json).to.have.been.calledWith({ message: 'Please Login' })
    expect(next).not.to.have.been.called
  })
  it('should handle missing authorization header', async () => {
    const req: Request = {
      headers: { authorization: 'Bearer1' },
    } as Request
    const res: Response = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as unknown as Response

    const token = req.headers.authorization?.split(' ')[1]

    await isAuthenticated(req, res, next)

    expect(token).to.be.undefined
    expect(res.status).to.have.been.calledWith(401)
    expect(res.json).to.have.been.calledWith({
      message: 'no access token found',
    })
    expect(next).not.to.have.been.called
  })

  afterEach(() => {
    sandbox.restore()
  })
})
