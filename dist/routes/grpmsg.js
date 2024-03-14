"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Middleware = require("../middlewares/authentication");
const MsgController = require("../controllers/msg");
const router = express.Router();
router.get("/allmsg", Middleware.UserAuthentication, MsgController.getAllMessages);
router.post("/postmsg", Middleware.UserAuthentication, MsgController.postGrpMessage);
module.exports = router;