import { Sequelize } from "sequelize";
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_SCHEMA as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    dialect: process.env.DB_DIALECT as any,
    host: process.env.DB_HOST as any,
  }
);

export default sequelize;
