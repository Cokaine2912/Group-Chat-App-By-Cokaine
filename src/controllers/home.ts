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

  return res.status(500).json({success : true , AllGroupsForThisUser : AllGroupsForThisUser })
};
