import chai from 'chai'
import chaiHttp from 'chai-http'
import { app, server } from '../index'
import sequelizeConnection from '../src/database/config/db.config'
import User from '../src/database/models/userModel'
import express from 'express'
chai.should()
chai.use(chaiHttp)
const { expect } = chai

const newUser = {
  username: 'Test',
  email: 'testx@gmail.com',
  password: 'Testing123',
}

const userExists = {
  username: 'Test',
  email: 'test6@gmail.com',
  password: 'Testing123',
}

const userInvalidEmail = {
  username: 'Test',
  email: 'test1gmail.com',
  password: 'Testing123',
}

before(async function setup() {
  this.timeout(20000)
  await sequelizeConnection.authenticate()
})

describe('Signup Test', () => {
  it('Should return a 400 status code indicating bad request', (done) => {
    chai
      .request(app)
      .post('/users/signup')
      .send(userInvalidEmail)
      .end((err, res) => {
        expect(res).to.have.status(400)
        done()
      })
  })

  it('Should return a 201 status code indicating success', async () => {
    chai
      .request(app)
      .post('/users/signup')
      .send(newUser)
      .end((err, res) => {
        expect(res).to.have.status(201)
      })
    await User.destroy({
      where: { email: newUser.email },
    })
  })
  // IF A USER ALREADY EXISTS
  it('Should return a 409 status code indicating conflicts', (done) => {
    chai
      .request(app)
      .post('/users/signup')
      .send(userExists)
      .end((err, res) => {
        expect(res).to.have.status(409)
        done()
      })
  })
})

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
