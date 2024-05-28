import { Server, Socket } from 'socket.io'
import eventEmitter from '../services/notificationServices'
import { UserAttributes } from '../database/models/userModel'

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

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as JwtPayload
    socket.join(user.id.toString())
  })
}

export default registerSocketEvents
