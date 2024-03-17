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
    const AddingPersonOBJ = (yield user_1.User.findByPk(AddingId));
    const AddingPersonEmail = AddingPersonOBJ.email;
    try {
        let GROUP = yield group_1.Group.findOne({ where: { groupName: GroupName } });
        if (!GROUP) {
            GROUP = yield group_1.Group.create({ groupName: GroupName });
            const MshipOBJ = {
                groupName: GroupName,
                member: AddingName,
                memberEmail: AddingPersonEmail,
                isAdmin: true,
                userId: AddingId,
                groupId: GROUP.id,
            };
            let AdminMship = yield membership_1.Membership.create(MshipOBJ);
            console.log(AdminMship);
        }
        // TO Check if the User Trying to Add is the
        const NewMemberToAdd = yield user_1.User.findOne({
            where: { email: NewMemberEmail },
        });
        if (!NewMemberToAdd) {
            return res.status(200).json({
                success: true,
                msg: "This email isn't registered, Plz invite to sign up",
            });
        } // Check for the Member is present on the platform or not
        const AlreadyExist = yield membership_1.Membership.findOne({
            where: {
                groupName: GroupName,
                userId: NewMemberToAdd.id,
            },
        });
        if (AlreadyExist) {
            return res.status(200).json({
                success: true,
                msg: "This email is already a part of the group !",
            });
        } /// check for the member if already exists in the group
        const NewMshipOBJ = {
            groupName: GROUP.groupName,
            member: NewMemberToAdd.username,
            memberEmail: NewMemberEmail,
            userId: NewMemberToAdd.id,
            groupId: GROUP.id,
        };
        const NewMship = yield membership_1.Membership.create(NewMshipOBJ);
        return res.status(201).json({
            success: true,
            NewMship: NewMship,
            msg: "New Member Added Successfully !",
        });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, msg: "Something went wrong" });
    }
});
