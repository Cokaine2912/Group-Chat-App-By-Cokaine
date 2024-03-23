"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function HASHING(password, saltrounds) {
    return new Promise((resolve, reject) => {
        bcrypt_1.default
            .hash(password, saltrounds)
            .then((hash) => {
            resolve(hash);
        })
            .catch((err) => {
            reject(err);
        });
    });
}
function DEHASHING(password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt_1.default
            .compare(password, hash)
            .then((op) => {
            resolve(op);
        })
            .catch((err) => {
            reject(err);
        });
    });
}
const SecretKey = process.env.JWT_SECRET_KEY; // JWT key
function generateAccessToken(id, name) {
    return jsonwebtoken_1.default.sign({ userId: id, username: name }, SecretKey);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.postNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("this route handler");
        console.log(req.body);
        const Exist = (yield user_1.User.count({
            where: { email: req.body.email },
        }));
        if (Exist) {
            return res
                .status(200)
                .json({ success: false, msg: "Email ID already regitered" });
        }
        const HASH = yield HASHING(req.body.password, 10);
        req.body.password = HASH;
        const op = yield user_1.User.create(req.body);
        return res
            .status(201)
            .json({ success: true, msg: "You can proceed to Login now" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});
exports.getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = (yield user_1.User.findOne({
            where: { email: email },
            attributes: ["id", "username", "password"],
        }));
        if (!user) {
            return res
                .status(404)
                .json({ success: false, msg: "This Email ID is not registered" });
        }
        const hash = user.password;
        const approve = yield DEHASHING(password, hash);
        if (!approve) {
            return res
                .status(401)
                .json({ success: false, msg: "Incorrect Password !" });
        }
        const token = generateAccessToken(user.id, user.username);
        return res.status(200).json({
            success: true,
            msg: "Further App work in Progress !!",
            token: token,
            username: user.username,
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
});
exports.getCreds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({
        IAM_USER_KEY: process.env.IAM_USER_KEY,
        IAM_USER_SECRET: process.env.IAM_USER_SECRET,
    });
});
