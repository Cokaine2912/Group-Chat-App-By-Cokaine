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
const group_1 = require("../models/group");
const membership_1 = require("../models/membership");
exports.postGrpMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userOBJ = req.headers.userOBJ;
    const userId = userOBJ.userId;
    const username = userOBJ.username;
    const msg = req.body.msg;
    const toGroup = req.body.toGroup;
    const fileUrl = req.body.fileUrl;
    const fileName = req.body.fileName;
    try {
        const ForGroupId = yield group_1.Group.findOne({
            where: { groupName: toGroup },
        });
        const op = (yield grpmsg_1.GroupMessage.create({
            userId: userId,
            sender: username,
            message: msg,
            fileUrl: fileUrl,
            fileName: fileName,
            toGroup: toGroup,
            groupId: ForGroupId.id,
        }));
        return res.json({
            id: op.id,
            sender: username,
            message: op.message,
            createdAt: op.createdAt,
            toGroup: toGroup,
        });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, msg: "Internal Server Error !" });
    }
});
exports.getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grouptoshow = req.headers.grouptoshow;
    try {
        const allMsgs = yield grpmsg_1.GroupMessage.findAll({
            where: { toGroup: grouptoshow },
        });
        return res.json({
            success: true,
            AllMessages: allMsgs,
            currentGroup: grouptoshow,
        });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, msg: "Internal Server Error !" });
    }
});
exports.getLatestMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lastMsgID = req.params.lastMsgID;
    const currentGroup = req.headers.grouptoshow;
    console.log("!!!!!  ### GETTING FOR :", currentGroup);
    try {
        const allMsgs = yield grpmsg_1.GroupMessage.findAll({
            where: {
                id: {
                    [sequelize_1.Op.gt]: +lastMsgID,
                },
                toGroup: currentGroup,
            },
        });
        if (allMsgs.length > 0) {
            return res
                .status(200)
                .json({ success: true, LatestMessages: allMsgs, status: "lagging" });
        }
        else {
            return res
                .status(200)
                .json({ success: true, LatestMessages: allMsgs, status: "up-to-date" });
        }
    }
    catch (error) {
        console.log(error);
        return res.json({ success: true, msg: "Internal Sever Error" });
    }
});
exports.getAllForGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentGroup = req.headers.grouptoshow;
    return res.json({ msg: "Atlest Reahed here !", currentGroup: currentGroup });
});
exports.getAdminCheck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.headers.userOBJ;
    const currentGroup = req.headers.grouptoshow;
    try {
        const AdminCheck = yield membership_1.Membership.findOne({
            where: {
                userId: user.userId,
                groupName: currentGroup,
            },
            attributes: ["groupName", "member", "isAdmin"],
        });
        return res.json({ success: true, AdminCheck: AdminCheck });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, msg: "Internal Server Error !" });
    }
});
exports.getAllGroupMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentGroup = req.headers.grouptoshow;
        const AllGroupMembers = yield membership_1.Membership.findAll({
            where: { groupName: currentGroup },
            attributes: ["member", "memberEmail", "isAdmin"],
        });
        return res.json({ success: true, AllGroupMembers: AllGroupMembers });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, msg: "Internal Server Error !" });
    }
});
exports.postRemoveMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentGroup = req.headers.grouptoshow;
    const toRemoveEmail = req.body.toRemoveId;
    try {
        const op = (yield membership_1.Membership.findOne({
            where: { groupName: currentGroup, memberEmail: toRemoveEmail },
        }));
        const Delop = yield op.destroy();
        return res.json({ success: true, removedMember: Delop });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, msg: "Internal Server Error !" });
    }
});
exports.postMakeAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentGroup = req.headers.grouptoshow;
    const toMakeEmail = req.body.toMakeId;
    try {
        const op = (yield membership_1.Membership.findOne({
            where: { groupName: currentGroup, memberEmail: toMakeEmail },
        }));
        const Updateop = yield op.update({ isAdmin: 1 });
        return res.json({ success: true, msg: `${toMakeEmail} is an Admin now !` });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, msg: "Internal Server Error !" });
    }
});
