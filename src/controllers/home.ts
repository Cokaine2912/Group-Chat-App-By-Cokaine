import { User } from "../models/user";

import { Group } from "../models/group";

import { Membership } from "../models/membership";
import { GroupMessage } from "../models/grpmsg";

interface USEROBJ {
  id: number;
  username: string;
  email: string;
  phone: string;
  password: string;
  createdAt: any;
  updatedAt: any;
}

async function PRECHECK(memberId: any, group: string) {
  try {
    const temp = (await Membership.findOne({
      where: { userId: memberId, groupName: group },
    })) as any;
    if (temp.isAdmin) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

exports.getAllGroups = async (req: any, res: any) => {
  const parsed = req.headers.userOBJ;
  const userId = parsed.userId;

  try {
    const AllGroupsForThisUser = await Membership.findAll({
      attributes: ["id", "groupName"], // Select only id and groupName columns
      where: {
        userId: userId, // Filter by userId
      },
    });

    return res
      .status(200)
      .json({ success: true, AllGroupsForThisUser: AllGroupsForThisUser });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: "Internal Server Error !" });
  }
};

exports.postAddMember = async (req: any, res: any) => {
  const parsed = req.headers.userOBJ;
  const AddingId = parsed.userId;
  const AddingName = parsed.username;
  const GroupName = req.body.GroupName;
  const NewMemberEmail = req.body.NewMemberEmail;

  try {
    const AddingPersonOBJ = (await User.findByPk(AddingId)) as any;
    const AddingPersonEmail = AddingPersonOBJ.email;
    let GROUP: any = await Group.findOne({ where: { groupName: GroupName } });

    let test;
    if (!GROUP) {
      GROUP = await Group.create({ groupName: GroupName });
      const MshipOBJ = {
        groupName: GroupName,
        member: AddingName,
        memberEmail: AddingPersonEmail,
        isAdmin: true,
        userId: AddingId,
        groupId: GROUP.id,
      };
      let AdminMship = await Membership.create(MshipOBJ);
    } else {
      test = await PRECHECK(AddingId, GroupName);
      if (!test) {
        return res.json({ success: false, msg: "You are not Authorized !" });
      }
    }

    // TO Check if the User Trying to Add is the

    const NewMemberToAdd: any = await User.findOne({
      where: { email: NewMemberEmail },
    });

    if (!NewMemberToAdd) {
      return res.status(200).json({
        success: true,
        msg: "This email isn't registered, Plz invite to sign up",
      });
    } // Check for the Member is present on the platform or not

    const AlreadyExist = await Membership.findOne({
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

    const NewMship = await Membership.create(NewMshipOBJ);

    return res.status(201).json({
      success: true,
      NewMship: NewMship,
      msg: "New Member Added Successfully !",
      test: test,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error !" });
  }
};

exports.getLatestMsg = async (req: any, res: any) => {
  const group = req.headers.group;
  const op = await GroupMessage.findAll({
    where: { toGroup: group },
    order: [['createdAt', 'DESC']],
    limit: 1,
  });
  return res.json({ success: true, latest: op });
};
