import { Request, Response } from 'express'
import { Op } from 'sequelize'
import Product from '../database/models/productModel'

const createProductQuery = (sellerId: number, productId: string) => {
  return {
    where: {
      [Op.and]: [{ id: productId }, { sellerId: sellerId }],
    },
  }
}

export const getProductById = async (sellerId: number, productId: string) => {
  const query = createProductQuery(sellerId, productId)
  const product = await Product.findOne(query)
  return product
}

export const deleteProductById = (sellerId: number, itemId: string) => {
    const querySearch =createProductQuery(sellerId, itemId)
    const productToDelete = Product.destroy(querySearch)
    return productToDelete
}
