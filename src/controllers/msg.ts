import { User } from "../models/user";

import { GroupMessage } from "../models/grpmsg";

import { Op } from "sequelize";

import { Group } from "../models/group";

import { Membership } from "../models/membership";

exports.postGrpMessage = async (req: any, res: any) => {
  const userOBJ = req.headers.userOBJ;
  const userId = userOBJ.userId;
  const username = userOBJ.username;
  const msg = req.body.msg;
  const toGroup = req.body.toGroup;

  try {
    const ForGroupId: any = await Group.findOne({
      where: { groupName: toGroup },
    });

    const op = (await GroupMessage.create({
      userId: userId,
      sender: username,
      message: msg,
      toGroup: toGroup,
      groupId: ForGroupId.id,
    })) as any;
    return res.json({
      id: op.id,
      sender: username,
      message: op.message,
      createdAt: op.createdAt,
      toGroup: toGroup,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, msg: "Internal Server Error !" });
  }
};

exports.getAllMessages = async (req: any, res: any) => {
  const grouptoshow = req.headers.grouptoshow;

  try {
    const allMsgs = await GroupMessage.findAll({
      where: { toGroup: grouptoshow },
    });
    return res.json({
      success: true,
      AllMessages: allMsgs,
      currentGroup: grouptoshow,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, msg: "Internal Server Error !" });
  }
};

exports.getLatestMessages = async (req: any, res: any) => {
  const lastMsgID = req.params.lastMsgID;
  const currentGroup = req.headers.grouptoshow;
  console.log("!!!!!  ### GETTING FOR :", currentGroup);
  try {
    const allMsgs = await GroupMessage.findAll({
      where: {
        id: {
          [Op.gt]: +lastMsgID,
        },
        toGroup: currentGroup,
      },
    });

    if (allMsgs.length > 0) {
      return res
        .status(200)
        .json({ success: true, LatestMessages: allMsgs, status: "lagging" });
    } else {
      return res
        .status(200)
        .json({ success: true, LatestMessages: allMsgs, status: "up-to-date" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: true, msg: "Internal Sever Error" });
  }
};

exports.getAllForGroup = async (req: any, res: any) => {
  const currentGroup = req.headers.grouptoshow;
  return res.json({ msg: "Atlest Reahed here !", currentGroup: currentGroup });
};

exports.getAdminCheck = async (req: any, res: any) => {
  const user = req.headers.userOBJ;
  const currentGroup = req.headers.grouptoshow;

  try {
    const AdminCheck = await Membership.findOne({
      where: {
        userId: user.userId,
        groupName: currentGroup,
      },
      attributes: ["groupName", "member", "isAdmin"],
    });

    return res.json({ success: true, AdminCheck: AdminCheck });
  } catch (error) {
    console.log(error);
    res.json({ success: false, msg: "Internal Server Error !" });
  }
};

exports.getAllGroupMembers = async (req: any, res: any) => {
  try {
    const currentGroup = req.headers.grouptoshow;

    const AllGroupMembers = await Membership.findAll({
      where: { groupName: currentGroup },
      attributes: ["member", "memberEmail", "isAdmin"],
    });

    return res.json({ success: true, AllGroupMembers: AllGroupMembers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, msg: "Internal Server Error !" });
  }
};

exports.postRemoveMember = async (req: any, res: any) => {
  const currentGroup = req.headers.grouptoshow;

  const toRemoveEmail = req.body.toRemoveId;

  try {
    const op = (await Membership.findOne({
      where: { groupName: currentGroup, memberEmail: toRemoveEmail },
    })) as any;

    const Delop = await op.destroy();
    return res.json({ success: true, removedMember: Delop });
  } catch (error) {
    console.log(error);
    res.json({ success: false, msg: "Internal Server Error !" });
  }
};

exports.postMakeAdmin = async (req: any, res: any) => {
  const currentGroup = req.headers.grouptoshow;

  const toMakeEmail = req.body.toMakeId;

  try {
    const op = (await Membership.findOne({
      where: { groupName: currentGroup, memberEmail: toMakeEmail },
    })) as any;

    const Updateop = await op.update({ isAdmin: 1 });

    return res.json({ success: true, msg: `${toMakeEmail} is an Admin now !` });
  } catch (error) {
    console.log(error);
    res.json({ success: false, msg: "Internal Server Error !" });
  }
};
