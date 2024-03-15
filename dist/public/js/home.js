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
function TakeToGroup(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        console.log(event.target.id);
        const GroupToShow = event.target.id;
        // const all = await axios.get(`http://localhost:6969/grpmsg/${GroupToShow}`, {
        //   headers: { token: TOKEN, GroupToShow: GroupToShow },
        // });
        const all = yield axios.get("http://localhost:6969/grpmsg/allmsg", {
            headers: { token: TOKEN, grouptoshow: GroupToShow },
        });
        console.log(all.data);
        const currentGroup = all.data.currentGroup;
        localStorage.setItem("currentGroup", currentGroup);
        const AllMessages = all.data.AllMessages;
        localStorage.setItem("chatHistory", JSON.stringify(AllMessages.slice(-30)));
        window.location.href = "./chat.html";
    });
}
function DISPLAYGROUP(obj) {
    const ul = document.getElementById("all-groups-list");
    const newli = document.createElement("li");
    newli.innerHTML = `<li class = "group-list-item"><a class = "group-link-a" id = "${obj.groupName}" onclick = "TakeToGroup(event)">${obj.groupName}</a></li>`;
    ul.appendChild(newli);
}
function HOMELOAD() {
    return __awaiter(this, void 0, void 0, function* () {
        const op = yield axios.get("http://localhost:6969/home/allgrps", {
            headers: { token: TOKEN },
        });
        const AllGroupsForThisUser = op.data.AllGroupsForThisUser;
        if (AllGroupsForThisUser.length > 0) {
            for (let i = 0; i < AllGroupsForThisUser.length; i++) {
                DISPLAYGROUP(AllGroupsForThisUser[i]);
            }
        }
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
        const op = yield axios.post("http://localhost:6969/home/creategrp", obj, {
            headers: { token: TOKEN },
        });
        console.log(op.data);
        alert(op.data.msg);
    });
}
