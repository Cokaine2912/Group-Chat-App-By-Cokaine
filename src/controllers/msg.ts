import { User } from "../models/user";

import { GroupMessage } from "../models/grpmsg";

import { Op } from "sequelize";

import { Group } from "../models/group";

import { Membership } from "../models/membership";

import sequelize from "../util/database";

const AWS = require("aws-sdk");

exports.postGrpMessage = async (req: any, res: any) => {
  const userOBJ = req.headers.userOBJ;
  const userId = userOBJ.userId;
  const username = userOBJ.username;
  const msg = req.body.msg;
  const toGroup = req.body.toGroup;
  const fileUrl = req.body.fileUrl;
  const fileName = req.body.fileName;

  let transaction;

  try {
    transaction = await sequelize.transaction();

    const ForGroupId: any = await Group.findOne({
      where: { groupName: toGroup },
      transaction,
    });

    const op = (await GroupMessage.create(
      {
        userId: userId,
        sender: username,
        message: msg,
        fileUrl: fileUrl,
        fileName: fileName,
        toGroup: toGroup,
        groupId: ForGroupId.id,
      },
      { transaction }
    )) as any;

    await transaction.commit();

    return res.json({
      id: op.id,
      sender: username,
      message: op.message,
      createdAt: op.createdAt,
      toGroup: toGroup,
    });
  } catch (error) {
    console.log(error);
    await transaction?.rollback();
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
    res.status(500).json({ success: false, msg: "Internal Server Error !" });
  }
};

async function uploadToS3(data: any, filename: any) {
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
    s3bucket.upload(params, (err: any, res: any) => {
      if (err) {
        console.log("Something went wrong !", err);
        reject(err);
      } else {
        console.log("Success", res);
        resolve(res.Location);
      }
    });
  });
}

exports.postPostUploadFile = async (req: any, res: any) => {
  try {
    const fileData = req.file.buffer;
    const filename = req.body.filename;
    const op = await uploadToS3(fileData, filename);
    return res.status(200).json({ success: true, URL: op });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Something went wrong !" });
  }
};
