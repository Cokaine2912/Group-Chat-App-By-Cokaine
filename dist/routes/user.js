"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path_1 = __importDefault(require("path"));
const router = express.Router();
const userController = require("../controllers/user");
router.get("/", (req, res) => {
    const filePath = path_1.default.join(__dirname, "../public/views/login.html");
    console.log(filePath);
    res.sendFile(filePath);
});
router.post("/adduser", userController.postNewUser);
router.post("/userlogin", userController.getUser);
module.exports = router;
