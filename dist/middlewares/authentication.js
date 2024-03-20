"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SecretKey = "bfishfldsbubifbo"; // JWT key
exports.UserAuthentication = (req, res, next) => {
    const token = req.headers.token;
    const parsed = jsonwebtoken_1.default.verify(token, SecretKey);
    req.headers.userOBJ = parsed;
    // console.log(parsed);
    // console.log("MiddleWare Authentication Successful !");
    next();
};
