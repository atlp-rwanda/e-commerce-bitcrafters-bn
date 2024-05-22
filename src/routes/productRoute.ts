import express from 'express'
import configureMulter from '../middlewares/multer'
import validateRequest from '../utils/validateRequest'
import productSchema, {
  productStatusSchema,
} from '../validations/productValidation'
import collectionSchema from '../validations/collectionValidation'
import isAuthenticated, {
  checkPermission,
} from '../middlewares/authenticationMiddleware'
import productController from '../controllers/productController'
import { UserRole } from '../database/models/userModel'

const router = express.Router()

router.post(
  '/:id/product',
  isAuthenticated,
  checkPermission(UserRole.SELLER),
  configureMulter,
  validateRequest(productSchema, 'body'),
  productController.addProduct,
)
router.post(
  '/collection',
  isAuthenticated,
  checkPermission(UserRole.SELLER),
  validateRequest(collectionSchema, 'body'),
  productController.createCollection,
)
router.patch(
  '/product/:productId/status',
  isAuthenticated,
  checkPermission(UserRole.SELLER),
  validateRequest(productStatusSchema, 'body'),
  productController.changeProductStatus,
)

export default router
