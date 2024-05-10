import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {
  getUserByEmail,
  getUserById,
  getUserByUsername,
  createUser,
  getUserByRole,
  deleteUserById,
} from '../src/services/userServices'
import User from '../src/database/models/userModel'

chai.use(sinonChai)

describe('User Services', () => {
  let sandbox: sinon.SinonSandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const findOneStub = sandbox.stub(User, 'findOne').resolves({
        id: 1,
        email: 'test@example.com',
      } as User)

      const result = await getUserByEmail('test@example.com')

      expect(findOneStub).to.have.been.calledWith({
        where: { email: 'test@example.com' },
      })
      expect(result).to.deep.equal({ id: 1, email: 'test@example.com' })
    })
  })

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const findOneStub = sandbox.stub(User, 'findOne').resolves({
        id: 1,
        email: 'test@example.com',
      } as User)

      const result = await getUserById(1)

      expect(findOneStub).to.have.been.calledWith({ where: { id: 1 } })
      expect(result).to.deep.equal({ id: 1, email: 'test@example.com' })
    })
  })

  describe('getUserByUsername', () => {
    it('should return a user by username', async () => {
      const findOneStub = sandbox.stub(User, 'findAll').resolves([
        {
          id: 1,
          username: 'testuser',
        } as User,
        {
          id: 1,
          username: 'testuser',
        } as User,
      ])

      const result = await getUserByUsername('testuser')

      expect(findOneStub).to.have.been.calledWith({
        where: { username: 'testuser' },
      })
      expect(result).to.deep.equal([
        {
          id: 1,
          username: 'testuser',
        } as User,
        {
          id: 1,
          username: 'testuser',
        } as User,
      ])
    })
  })

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createStub = sandbox.stub(User, 'create').resolves({
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      } as User)

      const details = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      }

      const result = await createUser(details)

      expect(createStub).to.have.been.calledWith(details)
      expect(result).to.deep.equal({
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      })
    })
  })

  describe('getUserByRole', () => {
    it('should return a user by role', async () => {
      const findOneStub = sandbox.stub(User, 'findAll').resolves([
        {
          id: 1,
          username: 'testuser',
        } as User,
        {
          id: 1,
          username: 'testuser',
        } as User,
      ])

      const result = await getUserByRole('admin')

      expect(findOneStub).to.have.been.calledWith({
        where: { userRole: 'admin' },
      })
      expect(result).to.deep.equal([
        {
          id: 1,
          username: 'testuser',
        } as User,
        {
          id: 1,
          username: 'testuser',
        } as User,
      ])
    })
  })

  describe('deleteUserById', () => {
    it('should delete a user by id', async () => {
      const destroyStub = sandbox.stub(User, 'destroy').resolves(1)

      const result = await deleteUserById('1')

      expect(destroyStub).to.have.been.calledWith({ where: { id: '1' } })
      expect(result).to.equal(1)
    })
  })
})
