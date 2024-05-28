import { EventEmitter } from 'events'
import { Op } from 'sequelize'
import sendEmail from '../utils/sendEmail'
import User from '../database/models/userModel'
import Notification from '../database/models/notificationModel'

export const eventEmitter = new EventEmitter()

eventEmitter.on('collection:created', async (collection) => {
  const user = await User.findByPk(collection.sellerId)
  if (!user) {
    return
  }

  const users = await User.findAll({
    where: {
      verified: true,
      id: {
        [Op.ne]: user.id,
      },
    },
  })
  if (!users.length) {
    return
  }

  await Notification.create({
    userId: user.id,
    productId: collection.id,
    message: `Your collection has been added: ${collection.name}`,
  })

  const subject = 'Your collection has been added'
  const text = `Your collection ${collection.name} has been added! `
  await sendEmail(user.email, subject, text)
})

eventEmitter.on('product:created', async (product) => {
  const user = await User.findByPk(product.sellerId)
  if (!user) {
    return
  }

  const users = await User.findAll({
    where: {
      verified: true,
      id: {
        [Op.ne]: user.id,
      },
    },
  })
  if (!users.length) {
    return
  }

  await Notification.create({
    userId: user.id,
    productId: product.id,
    message: `Your product has been added: ${product.name}`,
  })

  const subject = 'Your product has been added'
  const text = `Your product ${product.name} has been added! Check it out: ${product.url}`
  await sendEmail(user.email, subject, text)

  users.forEach(async (user) => {
    await Notification.create({
      userId: user.id,
      productId: product.id,
      message: `A new product has been added: ${product.name}`,
    })
    const subject = 'New product added'
    const text = `We've added a new product: ${product.name}! Check it out: ${product.url}`
    await sendEmail(user.email, subject, text)
  })
})

export default eventEmitter
