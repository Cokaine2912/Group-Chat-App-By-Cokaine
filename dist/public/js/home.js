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
        // Setting Up The Main Content
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
</div>`;
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const GroupToShow = event.target.id;
        // ADMIN Checking  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        let AdminCheck = yield axios.get("http://13.201.21.152:6969/grpmsg/admincheck", {
            headers: { token: TOKEN, grouptoshow: GroupToShow },
        });
        AdminCheck = AdminCheck.data;
        let isAdmin = AdminCheck.AdminCheck.isAdmin; // THE isAdmin Boolean
        let AddButtonForAdmin = "";
        console.log("ADMIN CHECK  : ", AdminCheck.AdminCheck.isAdmin);
        let RemoveRight = "";
        let MakeAdminRight = "";
        let MemberStatus = "";
        if (isAdmin) {
            AddButtonForAdmin = `<button id="add-member-button">Group Info</button>
    <div id="add-member-popup-form" class="popup">
    <form
      class="popup-content"
      id="add-member-popup-content"
      onsubmit="ADDINGMEMBERTOGROUP(event)"
    >
      <span class="close" id="add-member-close" >&times;</span>
      <h2 id="add-member-form-heading">New Group</h2>
      <input
        type="text"
        placeholder="Group Name"
        id="add-member-group-name"
        name="name"
        required
      />
      <input
        type="email"
        id="add-member-email"
        name="email"
        required
        placeholder="New Member Email"
      /><br /><br />
      <button type="submit">Add Member</button>
      <div id="group-member-list-div"><ul id="group-members-list"></ul></div>
    </form>
  </div>`;
            RemoveRight = `<button id="remove-member-button" onclick="REMOVEMEMBER(event)">Remove</button>`;
            MakeAdminRight = `<button id="make-admin-button" onclick="MAKEADMIN(event)">Make Admin</button>`;
        }
        else {
            AddButtonForAdmin = `<button id="add-member-button">Group Info</button>
    <div id="add-member-popup-form" class="popup">
    <form
      class="popup-content"
      id="add-member-popup-content"
      onsubmit="ADDINGMEMBERTOGROUP(event)"
    >
      <span class="close" id="add-member-close" >&times;</span>
      <h2 id="add-member-form-heading">New Group</h2>
      <div id="group-member-list-div"><ul id="group-members-list"></ul></div>
    </form>
  </div>`;
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Setting Up The Group Name Header ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const chatHeader = document.getElementById("chat-header");
        chatHeader.innerHTML = `<h3 id="main-heading-h3">${GroupToShow}</h3>${AddButtonForAdmin}`;
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // const all = await axios.get(`http://13.201.21.152:6969/grpmsg/${GroupToShow}`, {
        //   headers: { token: TOKEN, GroupToShow: GroupToShow },
        // });
        // Getting All The Group Messages/Chats - Storing In LS And Displaying ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const all = yield axios.get("http://13.201.21.152:6969/grpmsg/allmsg", {
            headers: { token: TOKEN, grouptoshow: GroupToShow },
        });
        const currentGroup = all.data.currentGroup;
        localStorage.setItem("currentGroup", currentGroup);
        const AllMessages = all.data.AllMessages;
        localStorage.setItem("chatHistory", JSON.stringify(AllMessages.slice(-30)));
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const AddMemBtn = document.getElementById("add-member-button");
        if (AddMemBtn) {
            const PopupForm = document.getElementById("add-member-popup-form");
            const PopupFormHeading = document.getElementById("add-member-form-heading");
            PopupFormHeading.innerHTML = `${currentGroup}`;
            const GroupMemberList = document.getElementById("group-members-list");
            GroupMemberList.innerHTML = "";
            let allMembers = yield axios.get("http://13.201.21.152:6969/grpmsg/getallmembers", {
                headers: { token: TOKEN, grouptoshow: GroupToShow },
            });
            allMembers = allMembers.data.AllGroupMembers;
            for (let i = 0; i < allMembers.length; i++) {
                let memberOBJ = allMembers[i];
                let ForMakingAdmin = "";
                let MemberStatus;
                if (memberOBJ.isAdmin) {
                    MemberStatus = "Admin";
                }
                else {
                    MemberStatus = "Member";
                    ForMakingAdmin = MakeAdminRight;
                }
                const newli = document.createElement("li");
                newli.id = `${memberOBJ.memberEmail}-list-item`;
                newli.innerHTML = `${memberOBJ.member} - ${memberOBJ.memberEmail} - <div id="${memberOBJ.memberEmail}-member-status">${MemberStatus}</div> ${RemoveRight} ${ForMakingAdmin}`;
                GroupMemberList.appendChild(newli);
            }
            const FixedGroupName = document.getElementById("add-member-group-name");
            AddMemBtn.addEventListener("click", function () {
                console.log("Button clicked !!!");
                if (FixedGroupName) {
                    FixedGroupName.setAttribute("type", `hidden`);
                    FixedGroupName.setAttribute("value", `${currentGroup}`);
                    FixedGroupName.setAttribute("readonly", "true");
                }
                PopupForm.style.display = "block";
            });
            const AddMemberClose = document.querySelector("#add-member-close");
            AddMemberClose.addEventListener("click", function () {
                PopupForm.style.display = "none";
                HOMELOAD();
            });
        }
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
        // Fixing The PopUp Form
        // const OriginalForm = `<span class="close">&times;</span>
        //                 <h2 id="popup-form-heading">New Group</h2>
        //                 <input
        //                   type="text"
        //                   placeholder="Group Name"
        //                   id="new-group-name"
        //                   name="name"
        //                   required
        //                 />
        //                 <br /><br />
        //                 <input
        //                   type="email"
        //                   id="email"
        //                   name="email"
        //                   required
        //                   placeholder="New Member Email"
        //                 /><br /><br />
        //                 <button type="submit">Add Member</button>`;
        // const ResetForm = document.getElementById("popup-content") as HTMLFormElement;
        // ResetForm.innerHTML = OriginalForm;
        const op = yield axios.get("http://13.201.21.152:6969/home/allgrps", {
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
        const op = yield axios.post("http://13.201.21.152:6969/home/creategrp", obj, {
            headers: { token: TOKEN },
        });
        console.log(op.data);
        console.log(event.target.id);
        alert(op.data.msg);
    });
}
function ADDINGMEMBERTOGROUP(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const obj = {
            GroupName: event.target.name.value,
            NewMemberEmail: event.target.email.value,
        };
        const op = yield axios.post("http://13.201.21.152:6969/home/creategrp", obj, {
            headers: { token: TOKEN },
        });
        console.log(op.data);
        console.log(event.target.id);
        alert(op.data.msg);
        const TheUl = document.getElementById("group-members-list");
        console.log(TheUl);
        const newli = document.createElement("li");
        const memberOBJ = op.data.NewMship;
        newli.id = `${memberOBJ.memberEmail}-list-item`;
        let MemberStatus = "Member";
        let MakeAdminRight = "";
        if (memberOBJ.isAdmin) {
            MemberStatus = "Admin";
        }
        else {
            MakeAdminRight = `<button id="make-admin-button" onclick="MAKEADMIN(event)">Make Admin</button>`;
        }
        const RemoveRight = `<button id="remove-member-button" onclick="REMOVEMEMBER(event)">Remove</button>`;
        newli.innerHTML = `${memberOBJ.member} - ${memberOBJ.memberEmail} - <div id="${memberOBJ.memberEmail}-member-status">${MemberStatus}</div> ${RemoveRight} ${MakeAdminRight}`;
        TheUl.appendChild(newli);
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
            const all = yield axios.get("http://13.201.21.152:6969/grpmsg/allmsg", {
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
