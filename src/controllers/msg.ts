import { User } from "../models/user"

import { GroupMessage } from "../models/grpmsg"



exports.postGrpMessage = async (req : any ,res : any) => {
    const userOBJ = req.headers.userOBJ 
    const userId = userOBJ.userId
    const username = userOBJ.username
    const msg = req.body.msg
    const op = await GroupMessage.create({userId : userId , message : msg}) as any
    return res.json({sender : username,message : op.message, time : op.createdAt})
}