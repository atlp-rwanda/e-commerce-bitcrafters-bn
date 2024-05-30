import { Server, Socket } from 'socket.io'
import eventEmitter from '../services/notificationServices'
import { UserAttributes } from '../database/models/userModel'
import { OrderItem } from '../database/models/orderModel'

interface JwtPayload extends UserAttributes {
  iat?: number
  exp?: number
}

const registerSocketEvents = (io: Server) => {
  eventEmitter.on('collection:created', (collection) => {
    io.to(collection.sellerId.toString()).emit('notification', {
      message: `A new collection has been added: ${collection.name}`,
    })
  })

  eventEmitter.on('product:created', (product) => {
    io.to(product.sellerId.toString()).emit('notification', {
      message: `A new product has registered: ${product.name}`,
    })
  })
  eventEmitter.on('order:created', async ({ user, order }) => {
    const productNames = order.items
      .map((item: OrderItem) => item.name)
      .join(', ')
    io.to(user.id.toString()).emit('notification', {
      message: `Your order with name ${productNames} has been placed successfully.`,
    })
  })

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as JwtPayload
    socket.join(user.id.toString())
  })
}

export default registerSocketEvents
