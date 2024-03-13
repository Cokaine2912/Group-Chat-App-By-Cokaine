import Sequelize from "sequelize";

import sequelize  from '../util/database';

const GroupMessage = sequelize.define("grpmsg", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId :{
    type : Sequelize.INTEGER,
    allowNull : false,
  },
  message: { type: Sequelize.STRING, allowNull: false },
});

export {GroupMessage}
