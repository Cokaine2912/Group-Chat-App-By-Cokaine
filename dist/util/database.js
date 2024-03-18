"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize("group-chat-app", "admin", "Rh8fz3gded", {
    dialect: "mysql",
    host: "database-1.cvqia6ikk97o.ap-south-1.rds.amazonaws.com",
});
exports.default = sequelize;
