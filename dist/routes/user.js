"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
// router.get("/", (req: any, res: any) => {
//   const filePath = path.join(__dirname, "../public/views/login.html");
//   console.log(filePath);
//   res.sendFile(filePath);
// });
router.get("/creds/getConfig", userController.getCreds);
router.post("/adduser", userController.postNewUser);
router.post("/userlogin", userController.getUser);
module.exports = router;
