"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../util/database"));
const User = database_1.default.define("user", {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    username: { type: sequelize_1.default.STRING, allowNull: false },
    email: {
        type: sequelize_1.default.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    },
});
exports.User = User;
