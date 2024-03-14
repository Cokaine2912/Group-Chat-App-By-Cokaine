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
let lastMsgID;
function ONLOAD() {
    return __awaiter(this, void 0, void 0, function* () {
        const chatList = document.getElementById("all-chats-list");
        chatList.innerHTML = "";
        const token = localStorage.getItem("token");
        const all = yield axios.get("http://localhost:6969/grpmsg/allmsg", { headers: { token: token } });
        const AllMessages = all.data.AllMessages;
        localStorage.setItem("chatHistory", JSON.stringify(AllMessages));
        lastMsgID = AllMessages[AllMessages.length - 1].id;
        console.log(lastMsgID);
        for (let i = 0; i < AllMessages.length; i++) {
            chatDisplay(AllMessages[i]);
            // ScrollDown()
        }
        const scrollableDiv = document.getElementById('chats-div');
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    });
}
setTimeout(ONLOAD, 0);
// setInterval(ONLOAD, 10000)
// ONLOAD()
function constantAPIcalls() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function ScrollDown() {
    const scrollableDiv = document.getElementById('chats-div');
    scrollableDiv.scrollTo({
        top: scrollableDiv.scrollHeight,
        behavior: 'smooth'
    });
}
function chatDisplay(obj) {
    let sender;
    let margin;
    const ChatUser = localStorage.getItem("ChatUser");
    if (ChatUser === obj.sender) {
        sender = "You";
        margin = 18;
    }
    else {
        sender = obj.sender;
        margin = 2;
    }
    const message = obj.message;
    const time = obj.createdAt;
    const date = new Date(time);
    const dateTime = date.toLocaleTimeString();
    const chatList = document.getElementById("all-chats-list");
    const newChatItem = document.createElement("li");
    newChatItem.className = "chat-item";
    newChatItem.style.marginLeft = `${margin}%`;
    newChatItem.innerHTML = `<label for="" class="${sender}-msg">${sender} :</label>
    <p>${message}</p><div class="msg-time-div" style="text-align: end;">${dateTime}</div>`;
    chatList === null || chatList === void 0 ? void 0 : chatList.appendChild(newChatItem);
}
function SENDMSG(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const msg = event.target.chatmsg.value;
        const token = localStorage.getItem("token");
        const obj = { msg: msg };
        const op = yield axios.post("http://localhost:6969/grpmsg/postmsg", obj, { headers: { token: token } });
        chatDisplay(op.data);
        ScrollDown();
        const msgBox = document.getElementById("chat-msg");
        msgBox.value = "";
    });
}
