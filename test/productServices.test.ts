import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import Product from '../src/database/models/productModel'
import {
  deleteProductById,
  getProductById,
} from '../src/services/productServices'

chai.use(sinonChai)

describe('Product Services', () => {
  let sandbox: sinon.SinonSandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const findOneStub = sandbox.stub(Product, 'findOne').resolves({
        id: 'd95193b1-5548-4650-adea-71f622667095',
        name: 'watch',
        price: 2000,
        sellerId: 1,
        bonus: 12,
        sku: 'fghj',
        images: ['dfghjk'],
      } as Product)

      const result = await getProductById(
        1,
        'd95193b1-5548-4650-adea-71f622667095',
      )

      expect(findOneStub).to.have.been.called
      expect(result).to.deep.equal({
        id: 'd95193b1-5548-4650-adea-71f622667095',
        name: 'watch',
        price: 2000,
        sellerId: 1,
        bonus: 12,
        sku: 'fghj',
        images: ['dfghjk'],
      })
    })
  })

  describe('deleteProductById', () => {
    it('should delete a product by id', async () => {
      const destroyStub = sandbox.stub(Product, 'destroy').resolves(1)

      const result = await deleteProductById(
        1,
        'd95193b1-5548-4650-adea-71f622667095',
      )

      expect(destroyStub).to.have.been.called
      expect(result).to.equal(1)
    })
  })
})
