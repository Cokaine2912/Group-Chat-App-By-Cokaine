import Sequelize from "sequelize";

import sequelize from "../util/database";

const ArchiveMessage = sequelize.define("archivemsg", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  sender: { type: Sequelize.STRING, allowNull: false },
  message: { type: Sequelize.STRING},
  fileName : {type : Sequelize.STRING},
  fileUrl : {type : Sequelize.STRING},
  toGroup: { type: Sequelize.STRING, allowNull: false },
});

export { ArchiveMessage };
