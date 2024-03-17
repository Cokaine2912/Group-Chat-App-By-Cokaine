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
        setInterval(constantAPIcalls, 5000);
        const main = document.getElementById("main");
        main.innerHTML = `<div class="chat-header" id ="chat-header">
  <h3 id="main-heading-h3">Group Chat By Cokaine</h3>
</div>
<div class="chat-messages" id="chats-div">
  <ul id="all-chats-list"></ul>
</div>

<div class="message-input">
  <form onsubmit="SENDMSG(event)" id="msg-write-form">
    <textarea
      name="chatmsg"
      id="chat-msg"
      cols="50"
      rows="2"
      placeholder="Message...."
    ></textarea>
    <button id="send-button">➤</button>
  </form>
  <!-- Message input form goes here -->
  <!-- You can add input fields for message text, send button, etc. -->
</div>`;
        console.log(event.target.id);
        const GroupToShow = event.target.id;
        const chatHeader = document.getElementById("chat-header");
        chatHeader.innerHTML = `<h3 id="main-heading-h3">${GroupToShow}</h3><button id="add-member-button">➕Add Member</button>`;
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
        const AddMemBtn = document.getElementById("add-member-button");
        const PopupForm = document.getElementById("popupForm");
        const FixedGroupName = document.getElementById("new-group-name");
        AddMemBtn.addEventListener("click", function () {
            console.log("Button clicked !!!");
            FixedGroupName.setAttribute("value", `${currentGroup}`);
            FixedGroupName.setAttribute("readonly", "true");
            PopupForm.style.display = "block";
        });
        NewONLOAD();
        // window.location.href = "./chat.html";
    });
}
function DISPLAYGROUP(obj) {
    const ul = document.getElementById("all-groups-list");
    const newli = document.createElement("li");
    newli.innerHTML = `<li class = "group-list-item" id = "${obj.groupName}" onclick = "TakeToGroup(event)">${obj.groupName}</li>`;
    ul.appendChild(newli);
    //   const groupTiles = document.getElementById(
    //     "group-tiles-div"
    //   ) as HTMLDivElement;
    //   const newDiv = document.createElement("div");
    //   newDiv.className = "col";
    //   newDiv.id = obj.groupName;
    //   newDiv.setAttribute("onclick", "TakeToGroup(event)");
    //   newDiv.innerHTML = `<img
    //   src="../../images/OIG4.6TcaQbttp97gtr.jpeg"
    //   alt="DP"
    //   class="group-dp"
    //   id = "${obj.groupName}" onclick = "TakeToGroup(event)"
    // />${obj.groupName}`;
    //   //
    //   groupTiles.appendChild(newDiv);
}
function HOMELOAD() {
    return __awaiter(this, void 0, void 0, function* () {
        const op = yield axios.get("http://localhost:6969/home/allgrps", {
            headers: { token: TOKEN },
        });
        const AllGroupsForThisUser = op.data.AllGroupsForThisUser;
        const groupList = document.getElementById("all-groups-list");
        groupList.innerHTML = "";
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
function NewONLOAD() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentGroup = localStorage.getItem("currentGroup");
        if (!currentGroup) {
            window.location.href = "./chathome.html";
        }
        const chatList = document.getElementById("all-chats-list");
        chatList.innerHTML = "";
        let History = localStorage.getItem("chatHistory");
        let AllMessages;
        if (History) {
            AllMessages = JSON.parse(History);
        }
        else {
            const all = yield axios.get("http://localhost:6969/grpmsg/allmsg", {
                headers: { token: token, grouptoshow: currentGroup },
            });
            AllMessages = all.data.AllMessages;
            localStorage.setItem("chatHistory", JSON.stringify(AllMessages.slice(-30)));
        }
        if (AllMessages.length > 0) {
            lastMsgID = AllMessages[AllMessages.length - 1].id;
        }
        else {
            lastMsgID = 0;
        }
        localStorage.setItem("lastMsgID", `${lastMsgID}`);
        for (let i = 0; i < AllMessages.length; i++) {
            chatDisplay(AllMessages[i]);
        }
        const scrollableDiv = document.getElementById("chats-div");
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    });
}
