const Sequilize = require("sequelize");

const sequelize = new Sequilize("group-chat-app", "root", "Sql2835@", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

