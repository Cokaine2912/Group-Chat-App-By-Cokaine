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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var user_1 = require("../models/user");
var bcrypt_1 = require("bcrypt");
var jsonwebtoken_1 = require("jsonwebtoken");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function HASHING(password, saltrounds) {
    return new Promise(function (resolve, reject) {
        bcrypt_1["default"]
            .hash(password, saltrounds)
            .then(function (hash) {
            resolve(hash);
        })["catch"](function (err) {
            reject(err);
        });
    });
}
function DEHASHING(password, hash) {
    return new Promise(function (resolve, reject) {
        bcrypt_1["default"]
            .compare(password, hash)
            .then(function (op) {
            resolve(op);
        })["catch"](function (err) {
            reject(err);
        });
    });
}
var SecretKey = "bfishfldsbubifbo"; // JWT key 
function generateAccessToken(id, name) {
    return jsonwebtoken_1["default"].sign({ userId: id, username: name }, SecretKey);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.postNewUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var Exist, HASH, op, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                console.log("this route handler");
                console.log(req.body);
                return [4 /*yield*/, user_1.User.count({ where: { email: req.body.email } })];
            case 1:
                Exist = _a.sent();
                if (Exist) {
                    return [2 /*return*/, res.status(200).json({ success: false, msg: "Email ID already regitered" })];
                }
                return [4 /*yield*/, HASHING(req.body.password, 10)];
            case 2:
                HASH = _a.sent();
                req.body.password = HASH;
                return [4 /*yield*/, user_1.User.create(req.body)];
            case 3:
                op = _a.sent();
                return [2 /*return*/, res.status(201).json({ success: true, msg: "You can proceed to Login now" })];
            case 4:
                err_1 = _a.sent();
                console.log(err_1);
                res.status(500).json({ error: err_1 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, user, hash, approve, token, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                password = req.body.password;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, user_1.User.findOne({ where: { email: email }, attributes: ["id", "username", "password"] })];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ success: false, msg: "This Email ID is not registered" })];
                }
                hash = user.password;
                return [4 /*yield*/, DEHASHING(password, hash)];
            case 3:
                approve = _a.sent();
                if (!approve) {
                    return [2 /*return*/, res.status(401).json({ success: false, msg: "Incorrect Password !" })];
                }
                token = generateAccessToken(user.id, user.username);
                return [2 /*return*/, res.status(200).json({ success: true, msg: "Further App work in Progress !!", token: token, username: user.username })];
            case 4:
                err_2 = _a.sent();
                return [2 /*return*/, res.status(500).json({ success: false, message: "Internal Server Error" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
// exports.postValidateUser = async (req: any, res: any) => {
//     try {
//     }
//     catch (err) {
//         res.status(500).json({ error: err })
//     }
// }
