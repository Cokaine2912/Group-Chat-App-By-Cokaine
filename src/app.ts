import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import http from "http";
import { CronJob } from "cron";
import morgan from "morgan";

import { Server } from "socket.io";

import sequelize from "./util/database";

import { User } from "./models/user";

import { GroupMessage } from "./models/grpmsg";

import { ArchiveMessage } from "./models/archive";

import { Membership } from "./models/membership";

import { Group } from "./models/group";

require("dotenv").config();

const userRoutes = require("./routes/user");
const grpRoutes = require("./routes/grpmsg");
const homeRoutes = require("./routes/home");

const app = express();

app.use(cors());

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));


const server = http.createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("A USER CONNECTED :", socket.id, "!!!!");
  socket.on("joinRoom", (obj) => {
    socket.join(obj.room);
    console.log(
      `Socket ${socket.id} - ${obj.chatUser} joined room ${obj.room}`
    );
    const joinOBJ = {
      room: obj.room,
      socketId: socket.id,
      chatUser: obj.chatUser,
    };
    socket.broadcast.to(obj.room).emit("join alert", joinOBJ);
  });
  socket.on("chat message", (obj) => {
    const msg = obj.msg;
    const sender = obj.sender;
    const groupName = obj.to;
    console.log(`${sender} ===> ${groupName} : ${msg}`);
    socket.emit("update own", { toUpdate: groupName, desc: "to self update" });
    socket.broadcast.to(groupName).emit("chat message", obj);
  });

  socket.on("new member addition", (obj: any) => {
    const groupToUpdate = obj.groupName;
    const newMember = obj.member;
    io.emit("HOMELOAD", { msg: "dummy" });
    // socket.broadcast.to(groupToUpdate).emit("update home", { msg: "dummy" });
  });

  socket.on("new group creation", (obj: any) => {
    io.emit("HOMELOAD", { msg: "dummy" });
  });

  socket.on("online alert", (obj: any) => {
    socket.emit("online info", { user: "You", room: obj.room });
    socket.broadcast
      .to(obj.room)
      .emit("online info", { user: obj.chatUser, room: obj.room });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use(bodyParser.json());

app.use(userRoutes);
app.use("/grpmsg", grpRoutes);
app.use("/home", homeRoutes);

app.get("/view/:file", (req: any, res: any) => {
  const file = req.params.file;
  const fp = path.join(__dirname, `./public/views/${file}`);
  res.sendFile(fp);
});
app.get("/js/:file", (req: any, res: any) => {
  const file = req.params.file;
  const fp = path.join(__dirname, `./public/js/${file}`);
  res.sendFile(fp);
});

app.get("/css/:file", (req: any, res: any) => {
  const file = req.params.file;
  const fp = path.join(__dirname, `./public/css/${file}`);
  res.sendFile(fp);
});

app.get("/images/:image", (req: any, res: any) => {
  const image = req.params.image;
  const fp = path.join(__dirname, `./images/${image}`);
  res.sendFile(fp);
});

app.get("/favicon.ico", (req: any, res: any) => {
  const fp = path.join(__dirname, "./favicon.ico");
  res.sendFile(fp);
});

console.log("Start at : ", new Date().toLocaleTimeString());

User.hasMany(GroupMessage);
GroupMessage.belongsTo(User);

User.hasMany(Membership);
Membership.belongsTo(User);

Group.hasMany(Membership);
Membership.belongsTo(Group);

Group.hasMany(GroupMessage);
GroupMessage.belongsTo(Group);

User.hasMany(ArchiveMessage);
ArchiveMessage.belongsTo(User);

Group.hasMany(ArchiveMessage);
ArchiveMessage.belongsTo(Group);

async function DAILYARCHIVE() {
  try {
    console.log("Time to Archive Chats of the Day.......");

    const allGrpMsgs = (await GroupMessage.findAll()) as any;

    for (let i = 0; i < allGrpMsgs.length; i++) {
      await ArchiveMessage.create({
        sender: allGrpMsgs[i].sender,
        message: allGrpMsgs[i].message,
        fileName: allGrpMsgs[i].fileName,
        fileUrl: allGrpMsgs[i].fileUrl,
        toGroup: allGrpMsgs[i].toGroup,
        userId: allGrpMsgs[i].UserId,
        groupId: allGrpMsgs[i].groupId,
        createdAt: allGrpMsgs[i].createdAt,
      });
    }

    console.log("All records transformed !");
  } catch (error) {
    console.log(error);
  }
}

const job = new CronJob(
  "0 0 0 */1 * *",
  DAILYARCHIVE,
  null,
  true,
  "Asia/Kolkata"
);
// job.start()

sequelize
  .sync()
  .then(() => {
    server.listen(6969);
  })
  .catch((err: any) => {
    console.log(err);
  });
