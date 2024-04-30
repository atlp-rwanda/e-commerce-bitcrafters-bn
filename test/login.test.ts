import chai from 'chai'
import chaiHttp from 'chai-http'
import bcrypt from 'bcryptjs'
import { app, server } from '../index'
import sequelizeConnection from '../src/database/config/db.config'
import User from '../src/database/models/userModel'

// Assertion styles and plugins setup
chai.should()
chai.use(chaiHttp)
const { expect } = chai

// Test user data
const existingUser = {
  username: 'Test',
  email: 'test@example.com',
  password: '', // Hashed password for "Testing123"
}

// Before running tests, ensure database connection and create a test user
before(async function setup() {
  this.timeout(20000)
  try {
    await sequelizeConnection.authenticate()
    // Hash the password before creating the user
    existingUser.password = await bcrypt.hash('Testing123', 10)
    // Check if the user already exists in the database
    const user = await User.findOne({ where: { email: existingUser.email } })
    // If the user doesn't exist, create it
    if (!user) {
      await User.create(existingUser)
    }
  } catch (error) {
    // console.error('Error setting up tests:', error)
    process.exit(1) // Exit with failure if setup fails
  }
})

// Test suite for login controller
describe('Login Controller', () => {
  // Test for bad request with invalid request body
  it('Should return a 400 status code indicating bad request with invalid request body', (done) => {
    chai
      .request(app)
      .post('/users/login')
      .send({ email: 'invalidemail@example.com' }) // Invalid request body missing password
      .end((err, res) => {
        expect(res).to.have.status(400)
        done()
      })
  })

  // Test for invalid email with non-existing email
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

  // Test for invalid password with existing email and incorrect password
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

  // Test for successful login with correct email and password
  it('Should return a 200 status code indicating successful login with correct email and password', (done) => {
    chai
      .request(app)
      .post('/users/login')
      .send({ email: existingUser.email, password: 'Testing123' }) // Use the correct password
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('jwt') // Check if JWT token is returned
        expect(res.body).to.have.property('message').equal('Login successful')
        done()
      })
  })
})

// After tests, close the server
after(async () => {
  // Check if the server is running before attempting to close it
  if (server && server.listening) {
    await new Promise<void>((resolve, reject) => {
      server.close((err?: Error) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
})
