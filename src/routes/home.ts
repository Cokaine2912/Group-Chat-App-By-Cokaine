const express = require("express");
import path from "path";

const Middleware = require("../middlewares/authentication");

const HomeController = require("../controllers/home");

const router = express.Router();

router.get(
  "/allgrps",
  Middleware.UserAuthentication,
  HomeController.getAllGroups
);

router.get(
  "/getlatest",
  Middleware.UserAuthentication,
  HomeController.getLatestMsg
);

router.post(
  "/creategrp",
  Middleware.UserAuthentication,
  HomeController.postAddMember
);

module.exports = router;
