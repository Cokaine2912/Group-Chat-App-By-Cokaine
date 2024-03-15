import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import sequelize from './util/database';

import { User } from "./models/user";

import { GroupMessage } from "./models/grpmsg";

import { Membership } from "./models/membership";

import { Group } from "./models/group";

const userRoutes = require("./routes/user")
const grpRoutes = require("./routes/grpmsg")
const homeRoutes = require("./routes/home")

const app = express();

app.use(cors(
  { origin: "http://127.0.0.1:3000", methods: ["GET", "POST"] }
));
app.use(bodyParser.json());

app.use(userRoutes);
app.use("/grpmsg",grpRoutes);
app.use("/home",homeRoutes)

app.get("/view/:file",(req :any,res:any)=>{
  const file = req.params.file
  const fp = path.join(__dirname,`./public/views/${file}`)
  res.sendFile(fp)

})
app.get("/js/:file", (req: any, res: any) => {
  const file = req.params.file
  const fp = path.join(__dirname, `./public/js/${file}`)
  res.sendFile(fp)
})

app.get("/css/:file", (req: any, res: any) => {
  const file = req.params.file
  const fp = path.join(__dirname, `./public/css/${file}`)
  res.sendFile(fp)
})

app.get("/images/:image",(req : any,res : any)=>{
  const image = req.params.image
  const fp = path.join(__dirname,`./images/${image}`)
  res.sendFile(fp)
})

app.get("/favicon.ico",(req : any, res : any)=>{
  const fp = path.join(__dirname,"./favicon.ico")
  res.sendFile(fp)
})

console.log("Start at : ", new Date().toLocaleTimeString())

User.hasMany(GroupMessage);
GroupMessage.belongsTo(User);

User.hasMany(Membership)
Membership.belongsTo(User)

Group.hasMany(Membership)
Membership.belongsTo(Group)

Group.hasMany(GroupMessage)
GroupMessage.belongsTo(Group)


sequelize
  .sync()
  .then(() => {
    app.listen(6969);
  })
  .catch((err: any) => {
    console.log(err);
  });