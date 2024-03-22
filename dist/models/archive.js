"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveMessage = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../util/database"));
const ArchiveMessage = database_1.default.define("archivemsg", {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    sender: { type: sequelize_1.default.STRING },
    message: { type: sequelize_1.default.STRING },
    fileName: { type: sequelize_1.default.STRING },
    fileUrl: { type: sequelize_1.default.STRING },
    toGroup: { type: sequelize_1.default.STRING },
});
exports.ArchiveMessage = ArchiveMessage;
