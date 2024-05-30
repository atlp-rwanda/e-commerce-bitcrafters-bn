import { Request, Response } from 'express'
import { Op } from 'sequelize'
import moment from 'moment'
import { UUID } from 'crypto'
import Collection from '../database/models/collectionModel'
import Product from '../database/models/productModel'

const createProductQuery = (sellerId: number, productId: string) => ({
    where: {
      [Op.and]: [{ id: productId }, { sellerId }],
    },
  })

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

export const getProductCount = async () => {
  const currentDate = moment().format('YYYY-MM-DD HH:mm:ssZ')

  const products = await Product.findAll({
    where: {
      productStatus: 'available',
      expiryDate: {
        [Op.gt]: currentDate,
      },
    },
  })
  return products.length
}

export const getProductCollectionCount = async (collectionId: string) => {
  const products = await Product.findAll({
    where: { collectionId },
  })
  return products.length
}
export const getCollectionCount = async (sellerId:number) => {
  const collections = await Collection.findAll({
    where: { sellerId }
  })
  return collections.length
}

export const searchProductsService = async (query: any) => {
  const { query: searchQuery, minPrice, maxPrice } = query

  const where: any = {}

  if (searchQuery) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${searchQuery}%` } },
      { category: { [Op.iLike]: `%${searchQuery}%` } },
    ]
  }

  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price[Op.gte] = Number(minPrice)
    if (maxPrice) where.price[Op.lte] = Number(maxPrice)
  }

  const products = await Product.findAll({ where })
  return products
}