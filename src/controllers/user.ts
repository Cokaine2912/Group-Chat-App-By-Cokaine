import { User } from "../models/user"
import bcrypt from "bcrypt"

interface ReqBody {
    username: string,
    email: string,
    phone: number,
    password: string
}

function HASHING(password :string , saltrounds : number) {
    return new Promise((resolve, reject) => {
      bcrypt
        .hash(password, saltrounds)
        .then((hash) => {
          resolve(hash);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  

exports.postNewUser = async (req: any, res: any) => {
    try {
        console.log("this route handler")
        console.log(req.body)

        const Exist = await User.count({where : {email : req.body.email}}) as number
        if (Exist){
            return res.status(200).json({success : false , msg : "Email ID already regitered"})
        } 

        const HASH = await HASHING(req.body.password , 10)
        req.body.password = HASH
        const op = await User.create(req.body)
        return res.status(201).json({success : true , msg : "You can proceed to Login now"})
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}

// exports.postValidateUser = async (req: any, res: any) => {
//     try {
        
//     }
//     catch (err) {
//         res.status(500).json({ error: err })
//     }
// }

