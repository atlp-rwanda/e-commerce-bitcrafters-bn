import dotenv from 'dotenv'
import { createClient } from 'redis'
import logger from './logger'

dotenv.config()

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    connectTimeout: 10000,
  },
})

redisClient.connect().catch((err) => {
  logger.log('error', `Redis connection error: ${err}`)
})

export default redisClient
