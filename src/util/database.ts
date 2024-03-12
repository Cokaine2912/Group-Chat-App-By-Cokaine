import { Sequelize } from 'sequelize';

const sequelize = new Sequelize("group-chat-app", "root", "Sql2835@", {
  dialect: "mysql",
  host: "localhost",
});

export default sequelize;

