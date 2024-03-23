"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const cron_1 = require("cron");
// import { createServer } from "http";
const socket_io_1 = require("socket.io");
const database_1 = __importDefault(require("./util/database"));
const user_1 = require("./models/user");
const grpmsg_1 = require("./models/grpmsg");
const archive_1 = require("./models/archive");
const membership_1 = require("./models/membership");
const group_1 = require("./models/group");
require("dotenv").config();
const userRoutes = require("./routes/user");
const grpRoutes = require("./routes/grpmsg");
const homeRoutes = require("./routes/home");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
io.on("connection", (socket) => {
    console.log("A USER CONNECTED :", socket.id, "!!!!");
    socket.on("joinRoom", (obj) => {
        // Join the specified room
        socket.join(obj.room);
        console.log(`Socket ${socket.id} - ${obj.chatUser} joined room ${obj.room}`);
    });
    socket.on("chat message", (obj) => {
        const msg = obj.msg;
        const sender = obj.sender;
        const groupName = obj.to;
        console.log(`${sender} ===> ${groupName} : ${msg}`);
        socket.emit("update own", { toUpdate: groupName, desc: "to self update" });
        socket.broadcast.to(groupName).emit("chat message", obj);
    });
    socket.on("new member addition", (obj) => {
        const groupToUpdate = obj.groupName;
        const newMember = obj.member;
        io.emit("HOMELOAD", { msg: "dummy" });
        // socket.broadcast.to(groupToUpdate).emit("update home", { msg: "dummy" });
    });
    socket.on("new group creation", (obj) => {
        io.emit("HOMELOAD", { msg: "dummy" });
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
app.use(body_parser_1.default.json());
app.use(userRoutes);
app.use("/grpmsg", grpRoutes);
app.use("/home", homeRoutes);
app.get("/view/:file", (req, res) => {
    const file = req.params.file;
    const fp = path_1.default.join(__dirname, `./public/views/${file}`);
    res.sendFile(fp);
});
app.get("/js/:file", (req, res) => {
    const file = req.params.file;
    const fp = path_1.default.join(__dirname, `./public/js/${file}`);
    res.sendFile(fp);
});
app.get("/css/:file", (req, res) => {
    const file = req.params.file;
    const fp = path_1.default.join(__dirname, `./public/css/${file}`);
    res.sendFile(fp);
});
app.get("/images/:image", (req, res) => {
    const image = req.params.image;
    const fp = path_1.default.join(__dirname, `./images/${image}`);
    res.sendFile(fp);
});
app.get("/favicon.ico", (req, res) => {
    const fp = path_1.default.join(__dirname, "./favicon.ico");
    res.sendFile(fp);
});
// app.get("/creds/getConfig", (req: any, res: any) => {
//   return res.json({
//     IAM_USER_KEY: process.env.IAM_USER_KEY,
//     IAM_USER_SECRET: process.env.IAM_USER_SECRET,
//   });
// });
console.log("Start at : ", new Date().toLocaleTimeString());
user_1.User.hasMany(grpmsg_1.GroupMessage);
grpmsg_1.GroupMessage.belongsTo(user_1.User);
user_1.User.hasMany(membership_1.Membership);
membership_1.Membership.belongsTo(user_1.User);
group_1.Group.hasMany(membership_1.Membership);
membership_1.Membership.belongsTo(group_1.Group);
group_1.Group.hasMany(grpmsg_1.GroupMessage);
grpmsg_1.GroupMessage.belongsTo(group_1.Group);
user_1.User.hasMany(archive_1.ArchiveMessage);
archive_1.ArchiveMessage.belongsTo(user_1.User);
group_1.Group.hasMany(archive_1.ArchiveMessage);
archive_1.ArchiveMessage.belongsTo(group_1.Group);
function DAILYARCHIVE() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Time to Archive Chats of the Day.......");
            const allGrpMsgs = (yield grpmsg_1.GroupMessage.findAll());
            for (let i = 0; i < allGrpMsgs.length; i++) {
                yield archive_1.ArchiveMessage.create({
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
        }
        catch (error) {
            console.log(error);
        }
    });
}
const job = new cron_1.CronJob("0 0 0 */1 * *", // cronTime
DAILYARCHIVE, // onTick
null, // onComplete
true, // start
"Asia/Kolkata" // timeZone
);
// job.start() is optional here because of the fourth parameter set to true.
database_1.default
    .sync({ force: true })
    .then(() => {
    server.listen(6969);
})
    .catch((err) => {
    console.log(err);
});
