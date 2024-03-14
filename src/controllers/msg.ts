import { User } from "../models/user"

import { GroupMessage } from "../models/grpmsg"

import {Op} from "sequelize"



exports.postGrpMessage = async (req : any ,res : any) => {
    const userOBJ = req.headers.userOBJ 
    const userId = userOBJ.userId
    const username = userOBJ.username
    const msg = req.body.msg
    const op = await GroupMessage.create({userId : userId , sender : username,message : msg}) as any
    return res.json({msgId : op.id , sender : username,message : op.message, createdAt : op.createdAt})
}

exports.getAllMessages = async (req : any , res : any) => {
    const allMsgs = await GroupMessage.findAll()
    return res.json({success : true , AllMessages : allMsgs })
}
exports.getLatestMessages = async (req : any , res : any) =>{

    const lastMsgID = req.params.lastMsgID 
    const allMsgs = await GroupMessage.findAll({
        where: {
          id: {
            [Op.gt]: +lastMsgID 
          }
        }
      });

    if (allMsgs){
        return res.status(200).json({success : true , LatestMessages : allMsgs })
    }  
    else {
        return
    }
    
      


}