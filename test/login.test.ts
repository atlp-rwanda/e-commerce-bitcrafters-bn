import chai from 'chai'
import chaiHttp from 'chai-http'
import bcrypt from 'bcryptjs'
import { app, server } from '../index'
import sequelizeConnection from '../src/database/config/db.config'
import User from '../src/database/models/userModel'

chai.should()
chai.use(chaiHttp)
const { expect } = chai

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

before(async function setup() {
  this.timeout(100000)
  try {
    await sequelizeConnection.authenticate()

    existingUser.password = await bcrypt.hash('Testing123', 10)
    const user = await User.findOne({ where: { email: existingUser.email } })
    if (!user) {
      await User.create(existingUser)
    }
  } catch (error) {
    process.exit(1)
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
        expect(res).to.have.status(401)
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
    expect(res).to.have.status(401)
    expect(res.body)
      .to.have.property('message')
      .to.equal('Check your email and verify your account')
  })
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
