const Sequilize = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequilize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: { type: Sequilize.STRING, allowNull: false },
  email: {
    type: Sequilize.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: Sequilize.NUMBER,
    allowNull: false,
  },
  password: {
    type: Sequilize.STRING,
    allowNull: false,
  },
});

module.exports = User;
