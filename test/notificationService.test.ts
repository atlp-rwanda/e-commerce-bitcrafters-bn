import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'
import { EventEmitter } from 'events'
import User from '../src/database/models/userModel'
import Notification from '../src/database/models/notificationModel'
import * as sendEmail from '../src/utils/sendEmail'
import eventEmitter from '../src/services/notificationServices'

const emitter = new EventEmitter()
describe('EventEmitter', () => {
  let findByPkStub: sinon.SinonStub
  let findAllStub: sinon.SinonStub
  let createNotificationStub: sinon.SinonStub
  let sendEmailStub: sinon.SinonStub

  beforeEach(() => {
    findByPkStub = sinon.stub(User, 'findByPk')
    findAllStub = sinon.stub(User, 'findAll')
    createNotificationStub = sinon.stub(Notification, 'create')
    sendEmailStub = sinon.stub(sendEmail, 'default')
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should handle collection creation and send notifications', async () => {
    const user = { id: 1, email: 'test@example.com', username: 'testuser' }
    const collection = { id: '1', name: 'New Collection', sellerId: 1 }

    findByPkStub.resolves(user)
    findAllStub.resolves([user])
    createNotificationStub.resolves({})
    sendEmailStub.resolves()

    await eventEmitter.emit('collection:created', collection)

    expect(findByPkStub).to.have.been.calledWith(collection.sellerId)
    expect(findAllStub).to.have.been.called
  })

  it('should handle no other verified users for collection', async () => {
    const user = { id: 1, email: 'test@example.com', username: 'testuser' }
    const collection = { id: '1', name: 'New Collection', sellerId: 1 }

    findByPkStub.resolves(user)
    findAllStub.resolves([])
    createNotificationStub.resolves({})
    sendEmailStub.resolves()

    await eventEmitter.emit('collection:created', collection)

    expect(findByPkStub).to.have.been.calledWith(collection.sellerId)
    expect(findAllStub).to.have.been.called
  })

  it('should handle product creation and send notifications', async () => {
    const user = { id: 1, email: 'test@example.com', username: 'testuser' }
    const product = {
      id: '1',
      name: 'New Product',
      sellerId: 1,
      url: 'http://example.com',
    }

    findByPkStub.resolves(user)
    findAllStub.resolves([user])
    createNotificationStub.resolves({})
    sendEmailStub.resolves()

    await eventEmitter.emit('product:created', product)

    expect(findByPkStub).to.have.been.calledWith(product.sellerId)
    expect(findAllStub).to.have.been.called
  })

  it('should handle no other verified users for product', async () => {
    const user = { id: 1, email: 'test@example.com', username: 'testuser' }
    const product = {
      id: '1',
      name: 'New Product',
      sellerId: 1,
      url: 'http://example.com',
    }

    findByPkStub.resolves(user)
    findAllStub.resolves([])
    createNotificationStub.resolves({})
    sendEmailStub.resolves()

    await eventEmitter.emit('product:created', product)

    expect(findByPkStub).to.have.been.calledWith(product.sellerId)
    expect(findAllStub).to.have.been.called
  })
})
