import { config } from 'dotenv'
import { Sequelize } from 'sequelize'
import { SequelizeOptions } from 'sequelize-typescript'

config()
const APP_MODE: string = 'development'
const DB_HOST_MODE: string = process.env.DB_HOST_TYPE as string

/**
 * Get the database connection options.
 * @returns {SequelizeOptions} The Sequelize options.
 */
function getDbOptions(): SequelizeOptions {
  switch (APP_MODE) {
    case 'test':
      return {
        host: process.env.TEST_DATABASE_HOST as string, // Use host instead of URL
        port: parseInt(process.env.TEST_DATABASE_PORT), // Use port instead of URL
        database: process.env.TEST_DATABASE_NAME as string,
        username: process.env.TEST_DATABASE_USERNAME as string,
        password: process.env.TEST_DATABASE_PASSWORD as string,
        dialect: 'postgres',
        dialectOptions: getDialectOptions(),
        logging: false,
      }
    case 'production':
      return {
        host: process.env.PROD_DATABASE_HOST as string, // Use host instead of URL
        port: parseInt(process.env.PROD_DATABASE_PORT), // Use port instead of URL
        database: process.env.PROD_DATABASE_NAME as string,
        username: process.env.PROD_DATABASE_USERNAME as string,
        password: process.env.PROD_DATABASE_PASSWORD as string,
        dialect: 'postgres',
        dialectOptions: getDialectOptions(),
        logging: false,
      }
    default:
      return {
        host: process.env.DEV_DATABASE_HOST as string, // Use host instead of URL
        port: parseInt(process.env.DEV_DATABASE_PORT), // Use port instead of URL
        database: process.env.DEV_DATABASE_NAME as string,
        username: process.env.DEV_DATABASE_USERNAME as string,
        password: process.env.DEV_DATABASE_PASSWORD as string,
        dialect: 'postgres',
        dialectOptions: getDialectOptions(),
        logging: false,
      }
  }
}

/**
 * Get dialect options for Sequelize.
 * @returns {DialectOptions} The dialect options.
 */
function getDialectOptions(){
  return DB_HOST_MODE === 'local'
    ? {}
    : {
        ssl: {
          require: true,
          rejectUnauthorized: true,
        },
      }
}

const sequelizeConnection: Sequelize = new Sequelize(getDbOptions())
export default sequelizeConnection
