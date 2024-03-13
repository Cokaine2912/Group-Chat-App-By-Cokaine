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
function SENDMSG(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const msg = event.target.chatmsg.value;
        const token = localStorage.getItem("token");
        const obj = { token: token, msg: msg };
        const op = yield axios.post("http://localhost:6969/grpmsg/postmsg", obj);
        console.log(op.data);
        const message = op.data.message;
        const sender = op.data.sender;
        const time = op.data.time;
        console.log("Message ready for DOM M", sender, message, time);
        /// DOM Manipulations accordingly
        const chatList = document.getElementById("all-chats-list");
        const newChatItem = document.createElement("li");
        newChatItem.className = "chat-item";
        newChatItem.innerHTML = `<label for="" class="${sender}-msg">${sender} :</label>
    <p>${message}</p>`;
        chatList === null || chatList === void 0 ? void 0 : chatList.appendChild(newChatItem);
    });
}
