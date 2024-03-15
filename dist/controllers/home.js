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
const user_1 = require("../models/user");
const group_1 = require("../models/group");
const membership_1 = require("../models/membership");
exports.getAllGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = req.headers.userOBJ;
    const userId = parsed.userId;
    const AllGroupsForThisUser = yield membership_1.Membership.findAll({
        attributes: ["id", "groupName"], // Select only id and groupName columns
        where: {
            userId: userId, // Filter by userId
        },
    });
    return res
        .status(200)
        .json({ success: true, AllGroupsForThisUser: AllGroupsForThisUser });
});
exports.postAddMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = req.headers.userOBJ;
    const AddingId = parsed.userId;
    const AddingName = parsed.username;
    const GroupName = req.body.GroupName;
    const NewMemberEmail = req.body.NewMemberEmail;
    console.log("Inside the postAddMember !!! ##########");
    try {
        let GROUP = yield group_1.Group.findOne({ where: { groupName: GroupName } });
        if (!GROUP) {
            GROUP = yield group_1.Group.create({ groupName: GroupName });
            const MshipOBJ = {
                groupName: GroupName,
                member: AddingName,
                isAdmin: true,
                userId: AddingId,
                groupId: GROUP.id,
            };
            let AdminMship = yield membership_1.Membership.create(MshipOBJ);
            console.log(AdminMship);
        }
        const NewMemberToAdd = yield user_1.User.findOne({
            where: { email: NewMemberEmail },
        });
        /// check for the member already exists
        const NewMshipOBJ = {
            groupName: GROUP.groupName,
            member: NewMemberToAdd.username,
            userId: NewMemberToAdd.id,
            groupId: GROUP.id,
        };
        const NewMship = yield membership_1.Membership.create(NewMshipOBJ);
        return res.status(200).json({ success: true, NewMship: NewMship });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, msg: "Something went wrong" });
    }
});
