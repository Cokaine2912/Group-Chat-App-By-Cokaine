"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Middleware = require("../middlewares/authentication");
const HomeController = require("../controllers/home");
const router = express.Router();
router.get("/allgrps", Middleware.UserAuthentication, HomeController.getAllGroups);
router.post("/creategrp", Middleware.UserAuthentication, HomeController.postAddMember);
module.exports = router;
