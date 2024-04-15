import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 8080;
const POSTGRES_USERNAME = process.env.POSTGRES_USERNAME || 'postgres'
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'Ishgates01'
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || 'postgres'
const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432

const sequelize = new Sequelize({
  dialect: 'postgres',
  host:"database" || 'localhost',
  port: 5432,
  username: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE, 
});

export default  sequelize ; 
 