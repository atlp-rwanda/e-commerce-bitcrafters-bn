import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import express, { Request, Response, NextFunction } from 'express'
import Collection from '../src/database/models/collectionModel'
import productController from '../src/controllers/productController'

chai.use(sinonChai)

const createCollection = productController.createCollection

describe('createCollection', function createCollectionTest() {
  this.timeout(60000)

  let req: Request
  let res: Response
  let next: NextFunction
  let findOneStub: sinon.SinonStub
  let createStub: sinon.SinonStub

  beforeEach(() => {
    req = express.request as Request
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as unknown as Response
    next = sinon.spy()
    findOneStub = sinon.stub(Collection, 'findOne')
    createStub = sinon.stub(Collection, 'create')
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should create collection successfully', async () => {
    req.body = {
      name: 'Test Collection',
      description: 'Test Description',
    }
    req.user = { id: 123 }

    findOneStub.resolves(null)

    await createCollection(req, res)

    expect(createStub).to.have.been.calledWith({
      name: 'Test Collection',
      description: 'Test Description',
      sellerId: 123
    })
    expect(res.status).to.have.been.calledWith(201)
    expect(res.json).to.have.been.calledWith({
      message: 'Collection created successfully',
      collection: undefined,
    })
  })
  it('should handle errors during collection creation', async () => {
    req.body = {
      name: 'Test Product',
      description: 'Test Description',
    };
    req.user = { id: 123 };

    findOneStub.resolves(null);
    createStub.rejects(new Error('Creation error'));

    await createCollection(req, res);

    expect(res.status).to.have.been.calledWith(500);
    expect(res.json).to.have.been.calledWith({
      message: 'Internal server error',
    });
  });
})
