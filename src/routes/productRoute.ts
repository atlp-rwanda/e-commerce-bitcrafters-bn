import express from 'express'
import configureMulter from '../middlewares/multer'
import validateRequest from '../utils/validateRequest'
import productSchema, {
  productStatusSchema,
} from '../validations/productValidation'
import collectionSchema from '../validations/collectionValidation'
import isAuthenticated, {
  checkPermission,
  excludePermission
} from '../middlewares/authenticationMiddleware'
import productController from '../controllers/productController'
import { UserRole } from '../database/models/userModel'
import paramSchema,{ paramIdSchema } from '../validations/paramValidation'
import multer from 'multer'

const router = express.Router()
const upload = multer()
router.post(
  '/:id/product',
  isAuthenticated,
  checkPermission(UserRole.SELLER),
  configureMulter,
  validateRequest(productSchema, 'body'),
  productController.addProduct,
)
router.post(
  '/',
  isAuthenticated,
  checkPermission(UserRole.SELLER),
  validateRequest(collectionSchema, 'body'),
  productController.createCollection,
)

router.get(
  '/',
  isAuthenticated,
  checkPermission(UserRole.SELLER),
  productController.listAllCollections,
)

router.patch(
  '/product/:productId/status',
  isAuthenticated,
  checkPermission(UserRole.SELLER),
  validateRequest(productStatusSchema, 'body'),
  productController.changeProductStatus,
)
router.get(
  '/product/:id',
  isAuthenticated,
  productController.getProductDetails,
)


router.delete(
  '/products/:productId',
  isAuthenticated,
  validateRequest(paramIdSchema, 'params'),
  checkPermission(UserRole.SELLER),
  productController.deleteProduct
)
router.get(
  '/products',
  isAuthenticated,
  excludePermission(UserRole.SELLER),
  productController.listProducts,
)
router.get(
  '/:collectionId/products',
  isAuthenticated,
  checkPermission(UserRole.SELLER),
  productController.listCollectionProducts,
)

router.get(
  '/product',
  isAuthenticated,
  checkPermission(UserRole.SELLER),
  productController.getProducts,
)
router.put(
  '/:id/product',
  isAuthenticated,
  checkPermission(UserRole.SELLER),
  productController.updateProduct,
)
router.delete(
  '/:id/images',
  isAuthenticated,
  checkPermission(UserRole.SELLER),
  productController.removeImages
)
router.post(
  '/:id/images',
  isAuthenticated,
  checkPermission(UserRole.SELLER),
  upload.array('images'),
  productController.addImages
)

export default router
