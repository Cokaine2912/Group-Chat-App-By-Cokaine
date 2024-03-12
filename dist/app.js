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
// const sequelize = require("./util/database")
const User = require("./models/user");
const userRoutes = require("./routes/user");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://127.0.0.1:3000", methods: ["GET", "POST"] }));
app.use(body_parser_1.default.json());
app.use(userRoutes);
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
console.log("Start at : ", new Date().toLocaleTimeString());
database_1.default
    .sync()
    .then(() => {
    app.listen(6969);
})
    .catch((err) => {
    console.log(err);
});
