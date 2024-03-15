import { User } from "../models/user";

import { Group } from "../models/group";

import { Membership } from "../models/membership";

exports.getAllGroups = async (req: any, res: any) => {
  const parsed = req.headers.userOBJ;
  const userId = parsed.userId;

  const AllGroupsForThisUser = await Membership.findAll({
    attributes: ["id", "groupName"], // Select only id and groupName columns
    where: {
      userId: userId, // Filter by userId
    },
  });

  return res
    .status(200)
    .json({ success: true, AllGroupsForThisUser: AllGroupsForThisUser });
};

exports.postAddMember = async (req: any, res: any) => {
  const parsed = req.headers.userOBJ;
  const AddingId = parsed.userId;
  const AddingName = parsed.username;
  const GroupName = req.body.GroupName;
  const NewMemberEmail = req.body.NewMemberEmail;

  try {
    let GROUP: any = await Group.findOne({ where: { groupName: GroupName } });

    if (!GROUP) {
      GROUP = await Group.create({ groupName: GroupName });
      const MshipOBJ = {
        groupName: GroupName,
        member: AddingName,
        isAdmin: true,
        userId: AddingId,
        groupId: GROUP.id,
      };
      let AdminMship = await Membership.create(MshipOBJ);
      console.log(AdminMship);
    }

    const NewMemberToAdd: any = await User.findOne({
      where: { email: NewMemberEmail },
    });

    if (!NewMemberToAdd) {
      return res
        .status(200)
        .json({
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
      return res
        .status(200)
        .json({
          success: true,
          msg: "This email is already a part of the group !",
        });
    } /// check for the member if already exists in the group

    const NewMshipOBJ = {
      groupName: GROUP.groupName,
      member: NewMemberToAdd.username,
      userId: NewMemberToAdd.id,
      groupId: GROUP.id,
    };

    const NewMship = await Membership.create(NewMshipOBJ);

    return res
      .status(201)
      .json({
        success: true,
        NewMship: NewMship,
        msg: "New Member Added Successfully !",
      });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: "Something went wrong" });
  }
};
