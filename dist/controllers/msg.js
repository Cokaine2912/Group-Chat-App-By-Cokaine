"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpmsg_1 = require("../models/grpmsg");
const sequelize_1 = require("sequelize");
exports.postGrpMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userOBJ = req.headers.userOBJ;
    const userId = userOBJ.userId;
    const username = userOBJ.username;
    const msg = req.body.msg;
    const op = yield grpmsg_1.GroupMessage.create({ userId: userId, sender: username, message: msg });
    return res.json({ msgId: op.id, sender: username, message: op.message, createdAt: op.createdAt });
});
exports.getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allMsgs = yield grpmsg_1.GroupMessage.findAll();
    return res.json({ success: true, AllMessages: allMsgs });
});
exports.getLatestMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lastMsgID = req.params.lastMsgID;
    const allMsgs = yield grpmsg_1.GroupMessage.findAll({
        where: {
            id: {
                [sequelize_1.Op.gt]: +lastMsgID
            }
        }
    });
    if (allMsgs) {
        return res.status(200).json({ success: true, LatestMessages: allMsgs });
    }
    else {
        return;
    }
});
