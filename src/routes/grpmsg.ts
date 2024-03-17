const express = require("express");
import path from "path";

const Middleware = require("../middlewares/authentication");

const MsgController = require("../controllers/msg");

const router = express.Router();

// router.get("/:GroupToShow",Middleware.UserAuthentication,MsgController.getAllForGroup)

router.get(
  "/allmsg",
  Middleware.UserAuthentication,
  MsgController.getAllMessages
);

router.get(
  "/getlatest/:lastMsgID",
  Middleware.UserAuthentication,
  MsgController.getLatestMessages
);

router.get(
  "/admincheck",
  Middleware.UserAuthentication,
  MsgController.getAdminCheck
);

router.get(
  "/getallmembers",
  Middleware.UserAuthentication,
  MsgController.getAllGroupMembers
);

router.post(
  "/postmsg",
  Middleware.UserAuthentication,
  MsgController.postGrpMessage
);

module.exports = router;
