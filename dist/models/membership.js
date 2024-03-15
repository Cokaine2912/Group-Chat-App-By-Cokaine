"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Membership = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../util/database"));
const Membership = database_1.default.define("membership", {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    groupName: {
        type: sequelize_1.default.STRING,
        allowNull: false,
        unique: true,
    },
    member: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: sequelize_1.default.BOOLEAN,
        defaultValue: false,
    },
});
exports.Membership = Membership;