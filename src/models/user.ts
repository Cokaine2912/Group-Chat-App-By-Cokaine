import Sequilize from "sequelize";

import sequelize  from '../util/database';

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
    type: Sequilize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequilize.STRING,
    allowNull: false,
  },
});

export {User}
