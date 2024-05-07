export const POSTGRES_HOST = process.env.POSTGRES_HOST
export const DOCKER_POSTGRES_PORT = parseInt(
  process.env.DOCKER_POSTGRES_PORT,
  10,
)
export const DOCKER_LOCAL_PORT = parseInt(process.env.DOCKER_LOCAL_PORT, 10)
export const PORT = parseInt(process.env.PORT, 10)
export const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT, 10)
export const JWT_SECRET = process.env.JWT_SECRET ?? 'USER-AUTH'
export const DB_HOST_TYPE = process.env.DB_HOST_TYPE
export const DEV_DATABASE_URL = process.env.DEV_DATABASE_URL
export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL
export const PROD_DATABASE_URL = process.env.PROD_DATABASE_URL
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
export const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME ?? '7d'
export const SECURE = process.env.SECURE
export const NODEMAILER_SERVICE = process.env.NODEMAILER_SERVICE
export const NODEMAILER_HOST = process.env.NODEMAILER_HOST
export const NODEMAILER_EMAIL_PORT = parseInt(
  process.env.NODEMAILER_EMAIL_PORT,
  10,
)
export const NODEMAILER_SECURE = process.env.NODEMAILER_SECURE === 'true'
export const NODEMAILER_USER = process.env.NODEMAILER_USER
export const NODEMAILER_PASS = process.env.NODEMAILER_PASS
export const NODEMAILER_BASE_URL = process.env.NODEMAILER_BASE_URL
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD
export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = parseInt(process.env.REDIS_PORT, 10)
