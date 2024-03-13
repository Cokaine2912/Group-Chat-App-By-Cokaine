import jwt from "jsonwebtoken"

const SecretKey = "bfishfldsbubifbo" // JWT key 


interface PARSED {
    userId : number,
    username : string,
    iat : any
}

exports.UserAuthentication = (req : any ,res : any , next : Function) => {
    const token = req.body.token 
    const parsed = jwt.verify(token,SecretKey) as PARSED
    req.headers.userOBJ = parsed
    next()

}