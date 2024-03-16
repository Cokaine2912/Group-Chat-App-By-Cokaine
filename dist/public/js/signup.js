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
/// <reference types="axios" />
function SIGNUP(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const obj = {
            username: event.target.username.value,
            email: event.target.email.value,
            phone: event.target.phone.value,
            password: event.target.password.value,
        };
        const op = yield axios.post("http://localhost:6969/adduser", obj);
        alert(op.data.msg);
    });
}
function LOGIN(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const obj = {
            email: event.target.email.value,
            password: event.target.password.value
        };
        try {
            const op = yield axios.post("http://localhost:6969/userlogin", obj);
            const res = op.data;
            const token = res.token;
            const ChatUser = res.username;
            localStorage.setItem("ChatUser", ChatUser);
            localStorage.setItem("token", token);
            window.location.href = "./chathome.html";
        }
        catch (err) {
            return alert(err.response.data.msg);
        }
    });
}
