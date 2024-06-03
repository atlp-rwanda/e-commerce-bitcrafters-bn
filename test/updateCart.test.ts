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

const updateCart = cartController.updateCart

describe('Update cart Total price by + or - quantity', function () {
  this.timeout(60000)

  let req: Request
  let res: Response
  let next: NextFunction
  let findByPkStub: sinon.SinonStub
  let findOneStub: sinon.SinonStub
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
    updateStub = sinon.stub(Cart, 'update')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('updateCart', () => {
    it('should return 400 if cartId or items are missing', async () => {
      req.params = {}
      req.body = {}
      req.user = { id: 1 }
      await isAuthenticated(req, res, next)
      await checkPermission('buyer')(req, res, next)

      await updateCart(req, res)

      expect(res.status).to.have.been.calledWith(400)
      expect(res.json).to.have.been.calledWith({
        message: 'Items are required',
      })
    })

    it('should return 400 if userId is missing', async () => {
      req.params = { cartId: 'cartId' }
      req.body = { items: [] }
      req.user = null
      await isAuthenticated(req, res, next)

      await updateCart(req, res)

      expect(res.status).to.have.been.calledWith(400)
      expect(res.json).to.have.been.calledWith({
        message: 'User ID is required',
      })
    })

    it('should return 404 if cart is not found', async () => {
      req.params = { cartId: 'cartId' }
      req.body = { items: [] }
      req.user = { id: 1 }
      await isAuthenticated(req, res, next)
      await checkPermission('buyer')(req, res, next)
      findOneStub.resolves(null)

      await updateCart(req, res)

      expect(res.status).to.have.been.calledWith(404)
      expect(res.json).to.have.been.calledWith({
        message: 'Cart not found',
      })
    })

    it('should return 404 if product is not found', async () => {
      req.params = { cartId: '7ffc7b37-edc2-4a3a-b741-5174cda3f099' }
      req.body = {
        items: [
          { productId: '10f8635d-2166-466b-a9df-4bd416b1a20d', quantity: 1 },
        ],
      }
      req.user = { id: 5540, userRole: 'buyer' }
      await isAuthenticated(req, res, next)
      await checkPermission('buyer')(req, res, next)
      findByPkStub.resolves(null)
      findOneStub.resolves({
        id: '7ffc7b37-edc2-4a3a-b741-5174cda3f099',
        buyerId: 5540,
        status: 'active',
        items: [] as CartItem[],
        totalPrice: 0,
        totalQuantity: 0,
      })

      await updateCart(req, res)

      expect(res.status).to.have.been.calledWith(404)
      expect(res.json).to.have.been.calledWith({
        message: 'Product not found',
      })
    })

    it('should return 400 if quantity is invalid', async () => {
      req.params = { cartId: '7ffc7b37-edc2-4a3a-b741-5174cda3f099' }
      req.body = {
        items: [
          { productId: '7ffc7b37-edc2-4a3a-b741-5174cda3f099', quantity: 0 },
        ],
      }
      req.user = { id: 5540, userRole: 'buyer' }
      await isAuthenticated(req, res, next)
      await checkPermission('buyer')(req, res, next)
      findOneStub.resolves({
        id: '7ffc7b37-edc2-4a3a-b741-5174cda3f099',
        buyerId: 5540,
        status: 'active',
        items: [] as CartItem[],
        totalPrice: 0,
        totalQuantity: 0,
      })

      await updateCart(req, res)

      expect(res.status).to.have.been.calledWith(400)
      expect(res.json).to.have.been.calledWith({
        message: 'Invalid quantity',
      })
    })

    it('should return 400 if quantity exceeds available product stock', async () => {
     req.params = { cartId: '61ba3042-2a89-49c9-be57-6a365e612024' }
     req.body = {
       items: [
         {
           productId: '8d4939dd-2637-4fa6-875a-7d0031d04bd5',
           quantity: 6,
         },
       ],
     }
     req.user = { id: 5540 }
     await isAuthenticated(req, res, next)
     await checkPermission('buyer')(req, res, next)

     const product = {
       id: '8d4939dd-2637-4fa6-875a-7d0031d04bd5',
       name: 'Test Product',
       price: 10,
       quantity: 5, 
       images: ['imageUrl'],
     }
     const cart = {
       id: '61ba3042-2a89-49c9-be57-6a365e612024',
       buyerId: 5540,
       status: 'active',
       items: [
         {
           productId: '8d4939dd-2637-4fa6-875a-7d0031d04bd5',
           quantity: 4,
         } as CartItem,
       ],
       totalPrice: 50,
       totalQuantity: 4,
     }

     findByPkStub.resolves(product)
     findOneStub.resolves(cart)

     await updateCart(req, res)

     expect(res.status).to.have.been.calledWith(400)
     expect(res.json).to.have.been.calledWith({
       message: 'Products out of stock',
     })
    })
    
     it('should return 400 if product stock is not sufficient when adding a new product', async () => {
       req.params = { cartId: 'cartId' }
       req.body = {
         items: [{ productId: 'productId', quantity: 10 }],
       }
       req.user = { id: 1 }
       await isAuthenticated(req, res, next)
       await checkPermission('buyer')(req, res, next)

       const product = {
         id: 'productId',
         name: 'Test Product',
         price: 10,
         quantity: 5, // Insufficient stock
         images: ['imageUrl'],
       }
       const cart = {
         id: 'cartId',
         buyerId: 1,
         status: 'active',
         items: [] as CartItem[],
         totalPrice: 0,
         totalQuantity: 0,
       }

       findByPkStub.resolves(product)
       findOneStub.resolves(cart)

       await updateCart(req, res)

       expect(res.status).to.have.been.calledWith(400)
       expect(res.json).to.have.been.calledWith({
         message: 'Insufficient stock',
       })
     })


    it('should update cart successfully', async () => {
      req.params = { cartId: 'cartId' }
      req.body = {
        items: [{ productId: 'productId', quantity: 2 }],
      }
      req.user = { id: 1 }
      await isAuthenticated(req, res, next)
      await checkPermission('buyer')(req, res, next)

      const product = {
        id: 'productId',
        name: 'Test Product',
        price: 10,
        quantity: 5, // Assuming product stock is sufficient
        images: ['imageUrl'],
      }
      const cart = {
        id: 'cartId',
        buyerId: 1,
        status: 'active',
        items: [
          {
            productId: 'productId',
            name: 'Test Product',
            price: 10,
            quantity: 1,
            images: ['imageUrl'],
          } as CartItem,
        ],
        totalPrice: 10,
        totalQuantity: 1,
      }
      const updatedCart = {
        id: 'cartId',
        buyerId: 1,
        status: 'active',
        items: [
          {
            productId: 'productId',
            name: 'Test Product',
            price: 10,
            quantity: 2,
            images: ['imageUrl'],
          } as CartItem,
        ],
        totalPrice: 20,
        totalQuantity: 2,
      }

      findByPkStub.resolves(product)
      findOneStub.onFirstCall().resolves(cart)
      findOneStub.onSecondCall().resolves(updatedCart)
      updateStub.resolves([1, [updatedCart]])

      await updateCart(req, res)

      expect(updateStub).to.have.been.calledWith(
        {
          items: [
            {
              productId: 'productId',
              name: 'Test Product',
              price: 10,
              quantity: 2,
              images: ['imageUrl'],
            },
          ],
          totalPrice: 20,
          totalQuantity: 2,
        },
        {
          where: { id: 'cartId' },
        },
      )

      expect(res.status).to.have.been.calledWith(200)
      expect(res.json).to.have.been.calledWith({
        message: 'Cart updated successfully',
        cart: updatedCart,
      })
    })
     it('should return 400 if product stock is not sufficient when adding a new product', async () => {
       req.params = { cartId: 'cartId' }
       req.body = {
         items: [{ productId: 'productId', quantity: 10 }],
       }
       req.user = { id: 1 }
       await isAuthenticated(req, res, next)
       await checkPermission('buyer')(req, res, next)

       const product = {
         id: 'productId',
         name: 'Test Product',
         price: 10,
         quantity: 5, // Insufficient stock
         images: ['imageUrl'],
       }
       const cart = {
         id: 'cartId',
         buyerId: 1,
         status: 'active',
         items: [] as CartItem[],
         totalPrice: 0,
         totalQuantity: 0,
       }

       findByPkStub.resolves(product)
       findOneStub.resolves(cart)

       await updateCart(req, res)

       expect(res.status).to.have.been.calledWith(400)
       expect(res.json).to.have.been.calledWith({
         message: 'Insufficient stock',
       })
     })

     it('should add a new product and update the cart successfully if stock is sufficient', async () => {
       req.params = { cartId: 'cartId' }
       req.body = {
         items: [{ productId: 'productId', quantity: 2 }],
       }
       req.user = { id: 1 }
       await isAuthenticated(req, res, next)
       await checkPermission('buyer')(req, res, next)

       const product = {
         id: 'productId',
         name: 'Test Product',
         price: 10,
         quantity: 5, // Sufficient stock
         images: ['imageUrl'],
       }
       const cart = {
         id: 'cartId',
         buyerId: 1,
         status: 'active',
         items: [] as CartItem[],
         totalPrice: 0,
         totalQuantity: 0,
       }
       const updatedCart = {
         id: 'cartId',
         buyerId: 1,
         status: 'active',
         items: [
           {
             productId: 'productId',
             name: 'Test Product',
             price: 10,
             quantity: 2,
             images: ['imageUrl'],
           } as CartItem,
         ],
         totalPrice: 20,
         totalQuantity: 2,
       }

       findByPkStub.resolves(product)
       findOneStub.onFirstCall().resolves(cart)
       findOneStub.onSecondCall().resolves(updatedCart)
       updateStub.resolves([1, [updatedCart]])

       await updateCart(req, res)

       expect(updateStub).to.have.been.calledWith(
         {
           items: [
             {
               productId: 'productId',
               name: 'Test Product',
               price: 10,
               quantity: 2,
               images: ['imageUrl'],
             },
           ],
           totalPrice: 20,
           totalQuantity: 2,
         },
         {
           where: { id: 'cartId' },
         },
       )

       expect(res.status).to.have.been.calledWith(200)
       expect(res.json).to.have.been.calledWith({
         message: 'Cart updated successfully',
         cart: updatedCart,
       })
     })
  })
})
