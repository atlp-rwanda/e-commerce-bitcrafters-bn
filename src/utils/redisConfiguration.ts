import dotenv from 'dotenv'
import { createClient } from 'redis'
import { REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } from '../config'

dotenv.config()

const redisClient = createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
})

redisClient.connect()
export default redisClient
