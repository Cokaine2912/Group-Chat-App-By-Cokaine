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
const TOKEN = localStorage.getItem("token");
function HOMELOAD() {
    return __awaiter(this, void 0, void 0, function* () {
        const op = yield axios.get("http://localhost:6969/home/allgrps", {
            headers: { token: TOKEN },
        });
        const AllGroupsForThisUser = op.data.AllGroupsForThisUser;
    });
}
HOMELOAD();
function CREATEGROUP(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const obj = {
            GroupName: event.target.name.value,
            NewMemberEmail: event.target.email.value,
        };
        console.log(obj);
        const op = yield axios.post("http://localhost:6969/home/creategrp", obj, {
            headers: { token: TOKEN },
        });
        console.log(op.data);
    });
}
