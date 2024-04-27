import chai from 'chai'
import chaiHttp from 'chai-http'
import bcrypt from 'bcryptjs'
import { app, server } from '../index'
import sequelizeConnection from '../src/database/config/db.config'
import User from '../src/database/models/userModel'
import redisClient from '../src/utils/redisConfiguration'

chai.should()
chai.use(chaiHttp)
const { expect } = chai

let token: string

const existingUser = {
  username: 'Test',
  email: 'topvery@gmail.com',
  password: '',
}
const notVerifiedUser = {
  username: 'Unverified',
  email: 'unverified@gmail.com',
  password: '12345678',
}
const verifiedUser = {
  email: 'user7@gmail.com',
  password: 'user12345',
}

before(async function setup() {
  this.timeout(100000)
    await sequelizeConnection.authenticate()
    existingUser.password = await bcrypt.hash('Testing123', 10)
    const user = await User.findOne({ where: { email: existingUser.email } })
    if (!user) {
      await User.create(existingUser)
    }
})

describe('Login Controller', () => {
  it('Should return a 400 status code indicating bad request with invalid request body', (done) => {
    chai
      .request(app)
      .post('/users/login')
      .send({ email: 'invalidemail@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(400)
        done()
      })
  })

  it('Should return a 401 status code indicating invalid email with non-existing email', (done) => {
    chai
      .request(app)
      .post('/users/login')
      .send({ email: 'nonexisting@example.com', password: 'password' })
      .end((err, res) => {
        expect(res).to.have.status(404)
        done()
      })
  })
  it('Should return a 401 status code indicating invalid password with existing email and incorrect password', (done) => {
    chai
      .request(app)
      .post('/users/login')
      .send({ email: existingUser.email, password: 'incorrectpassword' })
      .end((err, res) => {
        expect(res).to.have.status(401)
        done()
      })
  })

  it('Should return a 200 status code indicating successful login with correct email and password', (done) => {
    chai
      .request(app)
      .post('/users/login')
      .send({ email: existingUser.email, password: '12345678' })
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
  })

  it('should return 401 if user is not verified', async () => {
    const res = await chai.request(app).post('/users/login').send({
      email: notVerifiedUser.email,
      password: notVerifiedUser.password,
    })
    expect(res).to.have.status
    expect(res.body)
      .to.have.property('message')
      .to.equal('A verification email has been sent')
  })
})
 // ======================  LOGOUT =============================================
it('Should logout user, remove token from Redis and headers', async function () {
  this.timeout(100000)
  
  // Login the user to obtain the JWT token
  const loginRes = await chai
    .request(app)
    .post('/users/login')
    .send({ email: existingUser.email, password: '12345678' })

  expect(loginRes).to.have.status(200)
  expect(loginRes.body).to.have.property('authToken')

  const token = loginRes.body.authToken

  const authenticatedUser = await User.findOne({ where: { email: existingUser.email } })
  if (!authenticatedUser) {
    throw new Error('Authenticated user not found')
  }

  const userId = authenticatedUser.id
  const tokenExistsBeforeLogout = await redisClient.exists(`user:${userId}`)
  expect(tokenExistsBeforeLogout).to.equal(1)

  // Perform the logout action after successful login
  const logoutRes = await chai
    .request(app)
    .post('/users/logout')
    .set('Authorization', `Bearer ${token}`)

  expect(logoutRes).to.have.status(200)
  expect(logoutRes.body).to.have.property('message', 'Logout successfully')

  const tokenExistsAfterLogout = await redisClient.exists(`user:${userId}`)
  expect(tokenExistsAfterLogout).to.equal(0)

  // Attempt to logout again with the same token
  const secondLogoutRes = await chai
    .request(app)
    .post('/users/logout')
    .set('Authorization', `Bearer ${token}`)

  expect(secondLogoutRes).to.have.status(401)
  expect(secondLogoutRes.body).to.have.property('message', 'Already logged out')
})

after(async () => {
  if (server && server.listening) {
    await new Promise<void>((resolve, reject) => {
      server.close((err?: Error) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
})