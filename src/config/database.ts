import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 3000;
const POSTGRES_USERNAME = process.env.POSTGRES_USERNAME;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE;

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "db" || "localhost",
  port: 5432,
  username: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
});

export default sequelize;
