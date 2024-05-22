import { Request, Response } from 'express'
import cloudinary from 'cloudinary'
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from '../config/index'
import Product from '../database/models/productModel'
import Collection from '../database/models/collectionModel'
import { getProductById } from '../services/productServices'
cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

/**
 * Product Controller class
 */
export default class productController {
  /**
   * Adding product
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async addProduct(req: Request, res: Response): Promise<Response> {
    try {
      const { name, price, category, bonus, sku, quantity, expiryDate } =
        req.body

      const collectionId = req.params.id
      const sellerId = req.user?.id

      const collection = await Collection.findByPk(collectionId)
      if (!collection) {
        return res.status(404).json({ message: 'Collection not found' })
      }

      const existingProduct = await Product.findOne({
        where: { name, sellerId, sku },
      })
      if (existingProduct) {
        return res.status(409).json({
          message: 'Product exists, please update your stock',
        })
      }

      const files = req.files as Express.Multer.File[]
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'Images are required' })
      }
      if (files.length < 4 || files.length > 8) {
        return res.status(400).json({ message: 'Please upload 4 to 8 images' })
      }

      const uploadedImages = await Promise.all(
        (req.files as Express.Multer.File[]).map(
          async (file: Express.Multer.File) => {
            const result = await cloudinary.v2.uploader.upload(file.path)
            return { secure_url: result.secure_url }
          },
        ),
      )

      const imageUrls = uploadedImages.map((image) => image.secure_url)

      await Product.create({
        name,
        price,
        category,
        collectionId,
        bonus,
        sku,
        quantity,
        images: imageUrls,
        expiryDate,
        sellerId,
      })

      return res.status(201).json({ message: 'Product added successfully' })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  /**
   * Create collection
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async createCollection(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const { name, description } = req.body
      const sellerId = req.user?.id

      const collection = await Collection.create({
        name,
        description,
        sellerId,
      })

      return res
        .status(201)
        .json({ message: 'Collection created successfully', collection })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
  /**
   * seller can mark product status as availbale or unavailable
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async changeProductStatus(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const sellerId = req.user.id
    const productId = req.params.productId
    const { productStatus } = req.body
    const product = await getProductById(sellerId, productId)

    if (!product) {
      return res.status(404).json({
        error:
          'Product not found or you are not authorized to update this product',
      })
    }

    const currentDate = new Date()
    if (
      (product.quantity === 0 || product.expiryDate < currentDate) &&
      productStatus === 'available'
    ) {
      return res.status(400).json({
        error:
          'Product cannot be marked as available. May be the quantity is zero or the product has expired.',
      })
    }
    const updatedProduct = await product.update({
      productStatus: productStatus,
    })
    return res.status(200).json({
      data: updatedProduct,
      message: `Product updated as ${productStatus}`,
    })
  }
}
