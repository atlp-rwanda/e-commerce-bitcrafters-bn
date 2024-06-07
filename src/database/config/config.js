const dotenv = require('dotenv')

dotenv.config()

const commonDatabaseConfig = {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
}

const sequelizeConfig = {
  development: {
    ...commonDatabaseConfig,
    host: process.env.DEV_DATABASE_HOST, // Use host instead of URL
    port: process.env.DEV_DATABASE_PORT, // Use port instead of URL
    database: process.env.DEV_DATABASE_NAME,
    username: process.env.DEV_DATABASE_USERNAME,
    password: process.env.DEV_DATABASE_PASSWORD,
  },
  test: {
    ...commonDatabaseConfig,
    host: process.env.TEST_DATABASE_HOST, // Use host instead of URL
    port: process.env.TEST_DATABASE_PORT, // Use port instead of URL
    database: process.env.TEST_DATABASE_NAME,
    username: process.env.TEST_DATABASE_USERNAME,
    password: process.env.TEST_DATABASE_PASSWORD,
  },
  production: {
    ...commonDatabaseConfig,
    host: process.env.PROD_DATABASE_HOST, // Use host instead of URL
    port: process.env.PROD_DATABASE_PORT, // Use port instead of URL
    database: process.env.PROD_DATABASE_NAME,
    username: process.env.PROD_DATABASE_USERNAME,
    password: process.env.PROD_DATABASE_PASSWORD,
  },
}

module.exports = sequelizeConfig
