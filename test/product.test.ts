import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import cloudinary from 'cloudinary';
import express, { Request, Response, NextFunction } from 'express';
import Product from '../src/database/models/productModel';
import Collection from '../src/database/models/collectionModel';
import productController from '../src/controllers/productController';

chai.use(sinonChai);

const addProduct = productController.addProduct;

describe('addProduct', function addProductTest() {
  this.timeout(60000);

  let req: Request;
  let res: Response;
  let next: NextFunction;
  let findOneStub: sinon.SinonStub;
  let createStub: sinon.SinonStub;
  let uploadStub: sinon.SinonStub;
  let findByPkStub: sinon.SinonStub;

  beforeEach(() => {
    req = express.request as Request;
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as unknown as Response;
    next = sinon.spy();
    findOneStub = sinon.stub(Product, 'findOne');
    createStub = sinon.stub(Product, 'create');
    uploadStub = sinon.stub(cloudinary.v2.uploader, 'upload');
    findByPkStub = sinon.stub(Collection, 'findByPk');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 409 if product already exists', async () => {
    req.body = {
      name: 'Test Product',
      price: 10,
      category: 'category',
      bonus: '10',
      sku: '456sku',
      quantity: 'quantity',
      expiryDate: '25-12-2027',
    };
    req.params = { id: 'collectionId' };
    req.user = { id: 123 };

    findOneStub.resolves({ name: 'Test Product' });
    findByPkStub.resolves({ id: 'collectionId' });

    await addProduct(req, res);

    expect(res.status).to.have.been.calledWith(409);
    expect(res.json).to.have.been.calledWith({
      message: 'Product exists, please update your stock',
    });
  });

  it('should return 404 if collection does not exist', async () => {
    req.body = {
      name: 'Test Product',
      price: 10,
      category: 'category',
      bonus: '10',
      sku: '456sku',
      quantity: 'quantity',
      expiryDate: '25-12-2027',
    };
    req.params = { id: 'collectionId' };
    req.user = { id: 123 };

    findByPkStub.resolves(null);

    await addProduct(req, res);

    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({
      message: 'Collection not found',
    });
  });

  it('should return 400 if no images are provided', async () => {
    req.body = {
      name: 'Test Product',
      price: 10,
      category: 'category',
      bonus: '10',
      sku: '456sku',
      quantity: 'quantity',
      expiryDate: '25-12-2027',
    };
    req.params = { id: 'collectionId' };
    req.user = { id: 123 };
    req.files = [];

    findByPkStub.resolves({ id: 'collectionId' });

    await addProduct(req, res);

    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith({
      message: 'Images are required',
    });
  });

  it('should return 400 if fewer than 4 images are provided', async () => {
    req.body = {
      name: 'Test Product',
      price: 10,
      category: 'category',
      bonus: '10',
      sku: '456sku',
      quantity: 'quantity',
      expiryDate: '25-12-2027',
    };
    req.params = { id: 'collectionId' };
    req.user = { id: 123 };
    req.files = [{ path: 'imagePath1' }, { path: 'imagePath2' }, { path: 'imagePath3' }] as Express.Multer.File[];

    findByPkStub.resolves({ id: 'collectionId' });

    await addProduct(req, res);

    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith({
      message: 'Please upload 4 to 8 images',
    });
  });

  it('should return 400 if more than 8 images are provided', async () => {
    req.body = {
      name: 'Test Product',
      price: 10,
      category: 'category',
      bonus: '10',
      sku: '456sku',
      quantity: 'quantity',
      expiryDate: '25-12-2027',
    };
    req.params = { id: 'collectionId' };
    req.user = { id: 123 };
    req.files = [
      { path: 'imagePath1' },
      { path: 'imagePath2' },
      { path: 'imagePath3' },
      { path: 'imagePath4' },
      { path: 'imagePath5' },
      { path: 'imagePath6' },
      { path: 'imagePath7' },
      { path: 'imagePath8' },
      { path: 'imagePath9' },
    ] as Express.Multer.File[];

    findByPkStub.resolves({ id: 'collectionId' });

    await addProduct(req, res);

    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith({
      message: 'Please upload 4 to 8 images',
    });
  });

  it('should add product successfully', async () => {
    req.body = {
      name: 'Test Product',
      price: 10,
      category: 'category',
      bonus: '10',
      sku: '456sku',
      quantity: 'quantity',
      expiryDate: '25-12-2027',
    };
    req.params = { id: 'collectionId' };
    req.files = [
      { path: 'imagePath1' },
      { path: 'imagePath2' },
      { path: 'imagePath3' },
      { path: 'imagePath4' },
    ] as Express.Multer.File[];
    req.user = { id: 123 };

    findOneStub.resolves(null);
    findByPkStub.resolves({ id: 'collectionId' });
    uploadStub.resolves({ secure_url: 'imageUrl' });

    await addProduct(req, res);

    expect(createStub).to.have.been.calledWith({
      name: 'Test Product',
      price: 10,
      category: 'category',
      collectionId: 'collectionId',
      bonus: '10',
      sku: '456sku',
      quantity: 'quantity',
      images: [ 'imageUrl', 'imageUrl', 'imageUrl', 'imageUrl' ],
      expiryDate: '25-12-2027',
      sellerId: 123,
    });
    expect(res.status).to.have.been.calledWith(201);
    expect(res.json).to.have.been.calledWith({
      message: 'Product added successfully',
    });
  });

  it('should handle errors during product creation', async () => {
    req.body = {
      name: 'Test Product',
      price: 10,
      category: 'category',
      bonus: '10',
      sku: '456sku',
      quantity: 'quantity',
      expiryDate: '25-12-2027',
    };
    req.params = { id: 'collectionId' };
    req.files = [
      { path: 'imagePath1' },
      { path: 'imagePath2' },
      { path: 'imagePath3' },
      { path: 'imagePath4' },
    ] as Express.Multer.File[];
    req.user = { id: 123 };

    findOneStub.resolves(null);
    findByPkStub.resolves({ id: 'collectionId' });
    uploadStub.resolves({ secure_url: 'imageUrl' });
    createStub.rejects(new Error('Creation error'));

    await addProduct(req, res);

    expect(res.status).to.have.been.calledWith(500);
    expect(res.json).to.have.been.calledWith({
      message: 'Internal server error',
    });
  });
});
