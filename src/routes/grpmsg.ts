const express = require("express");
import path from "path";

const Middleware = require("../middlewares/authentication")

const MsgController = require("../controllers/msg")

const router = express.Router();

router.post("/postmsg", Middleware.UserAuthentication,MsgController.postGrpMessage)


module.exports = router;