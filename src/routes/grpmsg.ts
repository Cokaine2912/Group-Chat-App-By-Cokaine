const express = require("express");
import path from "path";

const Middleware = require("../middlewares/authentication")

const MsgController = require("../controllers/msg")

const router = express.Router();

router.get("/allmsg",Middleware.UserAuthentication, MsgController.getAllMessages)

router.get("/getlatest/:lastMsgID",Middleware.UserAuthentication,MsgController.getLatestMessages)

router.post("/postmsg", Middleware.UserAuthentication,MsgController.postGrpMessage)


module.exports = router;