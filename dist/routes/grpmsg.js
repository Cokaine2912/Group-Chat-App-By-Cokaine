"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Middleware = require("../middlewares/authentication");
const MsgController = require("../controllers/msg");
const router = express.Router();
// router.get("/:GroupToShow",Middleware.UserAuthentication,MsgController.getAllForGroup)
router.get("/allmsg", Middleware.UserAuthentication, MsgController.getAllMessages);
router.get("/getlatest/:lastMsgID", Middleware.UserAuthentication, MsgController.getLatestMessages);
router.post("/postmsg", Middleware.UserAuthentication, MsgController.postGrpMessage);
module.exports = router;
