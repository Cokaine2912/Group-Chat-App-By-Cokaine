"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path_1 = __importDefault(require("path"));
const router = express.Router();
const userController = require("../controllers/user");
router.get("/js/:file", (req, res) => {
    const file = req.params.file;
    const fp = path_1.default.join(__dirname, `../public/js/${file}`);
    res.sendFile(fp);
});
router.get("/", (req, res) => {
    const filePath = path_1.default.join(__dirname, "../public/views/signup.html");
    console.log(filePath);
    res.sendFile(filePath);
});
router.post("/adduser", userController.postNewUser);
module.exports = router;
