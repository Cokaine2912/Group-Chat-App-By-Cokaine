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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpmsg_1 = require("../models/grpmsg");
const sequelize_1 = require("sequelize");
const group_1 = require("../models/group");
const membership_1 = require("../models/membership");
const database_1 = __importDefault(require("../util/database"));
const AWS = require("aws-sdk");
exports.postGrpMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userOBJ = req.headers.userOBJ;
    const userId = userOBJ.userId;
    const username = userOBJ.username;
    const msg = req.body.msg;
    const toGroup = req.body.toGroup;
    const fileUrl = req.body.fileUrl;
    const fileName = req.body.fileName;
    let transaction;
    try {
        transaction = yield database_1.default.transaction();
        const ForGroupId = yield group_1.Group.findOne({
            where: { groupName: toGroup },
            transaction,
        });
        const op = (yield grpmsg_1.GroupMessage.create({
            userId: userId,
            sender: username,
            message: msg,
            fileUrl: fileUrl,
            fileName: fileName,
            toGroup: toGroup,
            groupId: ForGroupId.id,
        }, { transaction }));
        yield transaction.commit();
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
        yield (transaction === null || transaction === void 0 ? void 0 : transaction.rollback());
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
        res.status(500).json({ success: false, msg: "Internal Server Error !" });
    }
});
function uploadToS3(data, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const BUCKET_NAME = "cokaineexpensetracker";
        const IAM_USER_KEY = process.env.IAM_USER_KEY;
        const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
        let s3bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET,
            Bucket: BUCKET_NAME,
        });
        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: "public-read",
        };
        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, res) => {
                if (err) {
                    console.log("Something went wrong !", err);
                    reject(err);
                }
                else {
                    console.log("Success", res);
                    resolve(res.Location);
                }
            });
        });
    });
}
exports.postPostUploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileData = req.file.buffer;
        const filename = req.body.filename;
        const op = yield uploadToS3(fileData, filename);
        return res.status(200).json({ success: true, URL: op });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Something went wrong !" });
    }
});
