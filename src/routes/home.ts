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

module.exports = router;
