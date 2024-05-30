import { Request, Response } from 'express'
import Product from '../database/models/productModel'
import Cart, { CartItem } from '../database/models/cartModel'

/**
 * Cart Controller class
 */
export default class cartController {
  /**
   * Add product to cart
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async addToCart(req: Request, res: Response): Promise<Response> {
    const { quantity } = req.body

    const { productId } = req.params

    const userId = req.user?.id

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }

    if (!productId || !userId) {
      return res
        .status(400)
        .json({ message: 'Product ID and user ID are required' })
    }

    const quantityNumber = Number(quantity)
    if (quantityNumber <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' })
    }

    const product = await Product.findByPk(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Product out of stock' })
    }

    let cart = await Cart.findOne({
      where: { buyerId: userId, status: 'active' },
    })

    if (!cart) {
      cart = await Cart.create({
        buyerId: userId,
        items: [],
        totalPrice: product.price * quantityNumber,
        totalQuantity: quantity,
        status: 'active',
      })
    }

    const existingCartItemIndex = cart.items.findIndex(
      (items: CartItem) => items.productId === productId,
    )

    if (existingCartItemIndex > -1) {
      const existingQuantity = cart.items[existingCartItemIndex].quantity
      const newQuantity = existingQuantity + quantityNumber

      if (newQuantity > product.quantity) {
        return res.status(400).json({ message: 'Insufficient stock' })
      }
      cart.items[existingCartItemIndex].quantity = newQuantity
    } else {
      const cartItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantityNumber,
        images: product.images,
      }
      cart.items.push(cartItem)
    }

    cart.totalPrice = cart.items.reduce(
      (total: number, item: CartItem) => total + item.price * item.quantity,
      0,
    )
    cart.totalQuantity = cart.items.reduce(
      (total: number, item: CartItem) => total + item.quantity,
      0,
    )

    await Cart.update(
      {
        items: cart.items,
        totalPrice: cart.totalPrice,
        totalQuantity: cart.totalQuantity,
      },
      { where: { id: cart.id } },
    )

    return res
      .status(201)
      .json({ message: 'Product added to cart successfully', cart })
  }

  /**
   * Gets the active cart for the user
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async viewCart(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' })
      }

      const cart = await Cart.findOne({
        where: { buyerId: userId, status: 'active' },
      })

      if (!cart) {
        return res.status(404).json({ message: 'No Cart Found' })
      }

      return res
        .status(200)
        .json({ message: 'Cart retrived successfully', cart })
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message })
    }
  }
}
