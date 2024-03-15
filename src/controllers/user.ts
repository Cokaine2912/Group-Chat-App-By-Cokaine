import { User } from "../models/user"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

interface ReqBody {
    username: string,
    email: string,
    phone: number,
    password: string
}
interface LoginUserObj {
    id : number,
    username : string,
    password : string
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function HASHING(password : string , saltrounds : number) {
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

function DEHASHING(password : string, hash : string) {
    return new Promise((resolve, reject) => {
      bcrypt
        .compare(password, hash)
        .then((op) => {
          resolve(op);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

const SecretKey = "bfishfldsbubifbo" // JWT key 

function generateAccessToken(id : number, name : string) {
  return jwt.sign(
    { userId: id, username: name },
    SecretKey
  );
}
  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

exports.getUser = async (req:any,res:any)=>{
    const email = req.body.email as string
    const password = req.body.password


    try{
      
    const user = await User.findOne({where : {email : email},attributes :["id","username","password"]}) as LoginUserObj | null
    if (!user) {
        return res.status(404).json({success : false , msg : "This Email ID is not registered"})
    }
    const hash = user.password
    const approve = await DEHASHING(password,hash)
    if (!approve) {
        return res.status(401).json({success : false , msg : "Incorrect Password !"})
    }

    const token = generateAccessToken(user.id , user.username )

    return res.status(200).json({success : true , msg : "Further App work in Progress !!" ,token : token , username : user.username})


    }catch(err){return res.status(500).json({success : false , message : "Internal Server Error"})}
    
    
}

// exports.postValidateUser = async (req: any, res: any) => {
//     try {
        
//     }
//     catch (err) {
//         res.status(500).json({ error: err })
//     }
// }

