"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("./util/database"));
const user_1 = require("./models/user");
const grpmsg_1 = require("./models/grpmsg");
const membership_1 = require("./models/membership");
const group_1 = require("./models/group");
const userRoutes = require("./routes/user");
const grpRoutes = require("./routes/grpmsg");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://127.0.0.1:3000", methods: ["GET", "POST"] }));
app.use(body_parser_1.default.json());
app.use(userRoutes);
app.use("/grpmsg", grpRoutes);
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
console.log("Start at : ", new Date().toLocaleTimeString());
user_1.User.hasMany(grpmsg_1.GroupMessage);
grpmsg_1.GroupMessage.belongsTo(user_1.User);
user_1.User.hasMany(membership_1.Membership);
membership_1.Membership.belongsTo(user_1.User);
group_1.Group.hasMany(membership_1.Membership);
membership_1.Membership.belongsTo(group_1.Group);
group_1.Group.hasMany(grpmsg_1.GroupMessage);
grpmsg_1.GroupMessage.belongsTo(group_1.Group);
database_1.default
    .sync()
    .then(() => {
    app.listen(6969);
})
    .catch((err) => {
    console.log(err);
});
