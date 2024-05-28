import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import express, { Request, Response, NextFunction } from 'express'
import Product from '../src/database/models/productModel'
import Cart, { CartItem } from '../src/database/models/cartModel'
import cartController from '../src/controllers/cartController'
import isAuthenticated, {
  checkPermission,
} from '../src/middlewares/authenticationMiddleware'

chai.use(sinonChai)

const addToCart = cartController.addToCart

describe('CartController', function () {
  this.timeout(60000)

  let req: Request
  let res: Response
  let next: NextFunction
  let findByPkStub: sinon.SinonStub
  let findOneStub: sinon.SinonStub
  let createStub: sinon.SinonStub
  let updateStub: sinon.SinonStub

  beforeEach(() => {
    req = express.request as Request
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as unknown as Response
    next = sinon.spy()
    findByPkStub = sinon.stub(Product, 'findByPk')
    findOneStub = sinon.stub(Cart, 'findOne')
    createStub = sinon.stub(Cart, 'create')
    updateStub = sinon.stub(Cart.prototype, 'update')
  })

  afterEach(() => {
    sinon.restore()
  })
  describe('addToCart', () => {
    it('should return 400 if productId or buyerId is missing', async () => {
      req.params = {}
      req.body = { quantity: 1 }
      req.user = { id: 1 }
      await isAuthenticated(req, res, next)
      await checkPermission('buyer')(req, res, next)

      await addToCart(req, res)

      expect(res.status).to.have.been.calledWith(400)
      expect(res.json).to.have.been.calledWith({
        message: 'Product ID and user ID are required',
      })
    })
    it('should return 400 if quantity is invalid', async () => {
      req.params = { productId: 'productId' }
      req.body = { quantity: 0 }
      req.user = { id: 123 }
      req.user = { userRole: 'buyer', id: 1 }
      await isAuthenticated(req, res, next)
      await checkPermission('buyer')(req, res, next)

      await addToCart(req, res)

      expect(res.status).to.have.been.calledWith(400)
      expect(res.json).to.have.been.calledWith({ message: 'Invalid quantity' })
    })

    it('should return 404 if product is not found', async () => {
      req.params = { productId: 'productId' }
      req.body = { quantity: 1 }
      req.user = { userRole: 'buyer', id: 123 }
      await isAuthenticated(req, res, next)
      await checkPermission('buyer')(req, res, next)
      findByPkStub.resolves(null)

      await addToCart(req, res)

      expect(res.status).to.have.been.calledWith(404)
      expect(res.json).to.have.been.calledWith({ message: 'Product not found' })
    })
    it('should return 400 if product quantity is insufficient', async () => {
      req.params = { productId: 'productId' }
      req.body = { quantity: 10 }
      req.user = { userRole: 'buyer', id: 123 }
      await isAuthenticated(req, res, next)
      await checkPermission('buyer')(req, res, next)
      const product = {
        id: 'productId',
        name: 'Test Product',
        price: 10,
        quantity: 5,
        images: ['imageUrl'],
      }

      findByPkStub.resolves(product)

      await addToCart(req, res)

      expect(res.status).to.have.been.calledWith(400)
      expect(res.json).to.have.been.calledWith({
        message: 'Product out of stock',
      })
    })

    it('should add product to cart successfully', async () => {
      req.params = { productId: 'productId' }
      req.body = { quantity: 1 }
      req.user = { userRole: 'buyer', id: 123 }
      await isAuthenticated(req, res, next)
      await checkPermission('buyer')(req, res, next)
      const product = {
        id: 'productId',
        name: 'Test Product',
        price: 10,
        quantity: 100,
        images: ['imageUrl'],
      }
      const cart = {
        id: 'a56eb4af-8194-413a-a487-d9884300c033',
        buyerId: 123,
        status: 'active',
        items: [] as CartItem[],
        totalPrice: 0,
        totalQuantity: 0,
      }

      findByPkStub.resolves(product)
      findOneStub.resolves(cart)
      updateStub.resolves([1, [cart]])

      await addToCart(req, res)

      expect(res.status).to.have.been.calledWith(201)
      expect(res.json).to.have.been.calledWith({
        message: 'Product added to cart successfully',
        cart,
      })
    })

    it('should create a new cart if no active cart exists', async () => {
      req.params = { productId: 'productId' }
      req.body = { quantity: 1 }
      req.user = { userRole: 'buyer', id: 123 }
      await isAuthenticated(req, res, next)
      await checkPermission('buyer')(req, res, next)
      const product = {
        id: 'productId',
        name: 'Test Product',
        price: 10,
        quantity: 100,
        images: ['imageUrl'],
      }
      const newCart = {
        id: 'a56eb4af-8194-413a-a487-d9884300c033',
        buyerId: 123,
        items: [
          {
            productId: 'productId',
            name: 'Test Product',
            price: 10,
            quantity: 1,
            images: ['imageUrl'],
          },
        ],
        totalPrice: 10,
        totalQuantity: 1,
        status: 'active',
      }

      findByPkStub.resolves(product)
      findOneStub.resolves(null)
      createStub.resolves(newCart)

      await addToCart(req, res)

      expect(createStub).to.have.been.calledWith({
        buyerId: 123,
        items: [
          {
            productId: 'productId',
            name: 'Test Product',
            price: 10,
            quantity: 1,
            images: ['imageUrl'],
          },
        ],
        totalPrice: 10,
        totalQuantity: 1,
        status: 'active',
      })
      expect(res.status).to.have.been.calledWith(201)
      expect(res.json).to.have.been.calledWith({
        message: 'Product added to cart successfully',
        cart: newCart,
      })
    })
  })
})
