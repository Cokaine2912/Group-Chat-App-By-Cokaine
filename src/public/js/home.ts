const TOKEN = localStorage.getItem("token");
const ChatUser = localStorage.getItem("ChatUser");

const WINDOW = window as any;
const socket = WINDOW.io();

const UsernameDrop = document.getElementById(
  "username-span"
) as HTMLSpanElement;
UsernameDrop.innerHTML = `${ChatUser}`;

async function TakeToGroup(event: any) {
  event.preventDefault();
  console.log(event.target);
  const target = event.target;
  let GroupToShow = null;

  if (
    target.matches(".group-dp") ||
    target.matches(".latest-msg-preview") ||
    target.matches(".group-name") ||
    target.matches(".group-info")
  ) {
    // Find the closest ancestor <li> element
    const listItem = target.closest(".group-list-item");

    if (listItem) {
      // Get the id attribute of the <li> element
      GroupToShow = listItem.id;
    }
  } else {
    GroupToShow = event.target.id;
  }

  // Setting Up The Main Content

  const main = document.getElementById("main") as HTMLDivElement;

  main.innerHTML = `<div class="chat-header" id ="chat-header">
  <h3 id="main-heading-h3">Group Chat By Cokaine</h3>
</div>
<div class="chat-messages" id="chats-div">
  <ul id="all-chats-list"></ul>
</div>

<div class="message-input">
  <form onsubmit="SENDMSG(event)" id="msg-write-form">
  <label for="file" class="custom-file-upload">
      <i class="fas fa-cloud-upload-alt"></i> Attach File
    </label>
  <input type="file" id="file" name="file" onchange="displayFileName()">
  <span id="file-name-display"></span>
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

  // ADMIN Checking  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  let AdminCheck = await axios.get("http://localhost:6969/grpmsg/admincheck", {
    headers: { token: TOKEN, grouptoshow: GroupToShow },
  });

  AdminCheck = AdminCheck.data;

  let isAdmin = AdminCheck.AdminCheck.isAdmin; // THE isAdmin Boolean

  let AddButtonForAdmin = "";

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
  } else {
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

  const chatHeader = document.getElementById("chat-header") as HTMLDivElement;
  chatHeader.innerHTML = `<h3 id="main-heading-h3">${GroupToShow}</h3>${AddButtonForAdmin}`;

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // const all = await axios.get(`http://localhost:6969/grpmsg/${GroupToShow}`, {
  //   headers: { token: TOKEN, GroupToShow: GroupToShow },
  // });

  // Getting All The Group Messages/Chats - Storing In LS And Displaying ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const all = await axios.get("http://localhost:6969/grpmsg/allmsg", {
    headers: { token: TOKEN, grouptoshow: GroupToShow },
  });

  const currentGroup = all.data.currentGroup;
  localStorage.setItem("currentGroup", currentGroup);

  const AllMessages = all.data.AllMessages;
  localStorage.setItem("chatHistory", JSON.stringify(AllMessages.slice(-30)));

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //GroupInfobutton ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const AddMemBtn = document.getElementById(
    "add-member-button"
  ) as HTMLButtonElement;

  if (AddMemBtn) {
    const PopupForm = document.getElementById(
      "add-member-popup-form"
    ) as HTMLDivElement;
    const PopupFormHeading = document.getElementById(
      "add-member-form-heading"
    ) as HTMLHeadingElement;
    PopupFormHeading.innerHTML = `${currentGroup}`;

    const GroupMemberList = document.getElementById(
      "group-members-list"
    ) as HTMLUListElement;
    GroupMemberList.innerHTML = "";
    let allMembers = await axios.get(
      "http://localhost:6969/grpmsg/getallmembers",
      {
        headers: { token: TOKEN, grouptoshow: GroupToShow },
      }
    );

    allMembers = allMembers.data.AllGroupMembers;

    for (let i = 0; i < allMembers.length; i++) {
      let memberOBJ = allMembers[i];
      let ForMakingAdmin = "";
      let MemberStatus;
      if (memberOBJ.isAdmin) {
        MemberStatus = "Admin";
      } else {
        MemberStatus = "Member";
        ForMakingAdmin = MakeAdminRight;
      }
      const newli = document.createElement("li");
      newli.id = `${memberOBJ.memberEmail}-list-item`;
      newli.innerHTML = `${memberOBJ.member} - ${memberOBJ.memberEmail} - <div id="${memberOBJ.memberEmail}-member-status">${MemberStatus}</div> ${RemoveRight} ${ForMakingAdmin}`;
      GroupMemberList.appendChild(newli);
    }

    const FixedGroupName = document.getElementById(
      "add-member-group-name"
    ) as HTMLInputElement;
    AddMemBtn.addEventListener("click", function () {
      console.log("Button clicked !!!");
      if (FixedGroupName) {
        FixedGroupName.setAttribute("type", `hidden`);
        FixedGroupName.setAttribute("value", `${currentGroup}`);
        FixedGroupName.setAttribute("readonly", "true");
      }
      PopupForm.style.display = "block";
    });

    const AddMemberClose = document.querySelector(
      "#add-member-close"
    ) as HTMLSpanElement;
    AddMemberClose.addEventListener("click", function () {
      PopupForm.style.display = "none";

      HOMELOAD();
    });
  }

  NewONLOAD();
}

interface DISPLAYGROUPOBJ {
  id: number;
  groupName: string;
}

function DISPLAYGROUP(obj: DISPLAYGROUPOBJ) {
  const ul = document.getElementById("all-groups-list") as HTMLUListElement;
  const newli = document.createElement("li");
  // newli.innerHTML = `<li class = "group-list-item" id = "${obj.groupName}" onclick = "TakeToGroup(event)">${obj.groupName}</li>`;

  newli.innerHTML = `
  <li class="group-list-item" id="${obj.groupName}" onclick = "TakeToGroup(event)">
  <div class="group-info">
  <img src="../../images/group_default.png" alt="Group DP" class="group-dp">
  <div class="group-name">${obj.groupName}</div>
</div>
<div class="latest-msg-preview">Latest message preview</div>
  </li>`;

  ul.appendChild(newli);

  // document.addEventListener("click", (event: any) => {
  //   // event.stopPropagation();
  //   const target = event.target;
  //   console.log("YE wala !", target);
  //   // if (
  //   //   target.matches(".group-dp") ||
  //   //   target.matches(".latest-msg-preview") ||
  //   //   target.matches(".group-name") ||
  //   //   target.matches(".group-info")
  //   // ) {
  //   //   // Handle click on the <li>, <img>, or <div> element
  //   //   TakeToGroup(event);
  //   // }
  // });
}

async function HOMELOAD() {
  try {
    const op = await axios.get("http://localhost:6969/home/allgrps", {
      headers: { token: TOKEN },
    });
    const AllGroupsForThisUser = op.data.AllGroupsForThisUser;
    const groupList = document.getElementById(
      "all-groups-list"
    ) as HTMLDivElement;
    groupList.innerHTML = "";
    if (AllGroupsForThisUser.length > 0) {
      for (let i = 0; i < AllGroupsForThisUser.length; i++) {
        DISPLAYGROUP(AllGroupsForThisUser[i]);
        await displayLatestMessages(AllGroupsForThisUser[i].groupName);
        socket.emit("joinRoom", {
          chatUser: ChatUser,
          room: AllGroupsForThisUser[i].groupName,
        });
      }
    }
  } catch (err) {
    console.log(err);
    alert("Something went wrong !");
  }
}
HOMELOAD();
// setInterval(HOMELOAD, 2000);

async function CREATEGROUP(event: any) {
  event.preventDefault();
  const obj = {
    GroupName: event.target.name.value,
    NewMemberEmail: event.target.email.value,
  };

  const op = await axios.post("http://localhost:6969/home/creategrp", obj, {
    headers: { token: TOKEN },
  });

  socket.emit("new group creation", { groupName: obj.GroupName });

  console.log(op.data);
  console.log(event.target.id);
  alert(op.data.msg);
}

async function ADDINGMEMBERTOGROUP(event: any) {
  event.preventDefault();
  const obj = {
    GroupName: event.target.name.value,
    NewMemberEmail: event.target.email.value,
  };
  try {
    const op = await axios.post("http://localhost:6969/home/creategrp", obj, {
      headers: { token: TOKEN },
    });
    alert(op.data.msg);

    const TheUl = document.getElementById(
      "group-members-list"
    ) as HTMLUListElement;
    console.log(TheUl);
    const newli = document.createElement("li");

    const memberOBJ = op.data.NewMship;
    socket.emit("new member addition", {
      groupToUpdate: memberOBJ.groupName,
      newMember: memberOBJ.member,
    });

    newli.id = `${memberOBJ.memberEmail}-list-item`;
    let MemberStatus = "Member";
    let MakeAdminRight = "";

    if (memberOBJ.isAdmin) {
      MemberStatus = "Admin";
    } else {
      MakeAdminRight = `<button id="make-admin-button" onclick="MAKEADMIN(event)">Make Admin</button>`;
    }

    const RemoveRight = `<button id="remove-member-button" onclick="REMOVEMEMBER(event)">Remove</button>`;

    newli.innerHTML = `${memberOBJ.member} - ${memberOBJ.memberEmail} - <div id="${memberOBJ.memberEmail}-member-status">${MemberStatus}</div> ${RemoveRight} ${MakeAdminRight}`;
    TheUl.appendChild(newli);
  } catch (err) {
    console.log(err);
    alert("Something Went Wrong !");
  }
}

async function NewONLOAD() {
  const currentGroup = localStorage.getItem("currentGroup");
  if (!currentGroup) {
    window.location.href = "./chathome.html";
  }

  const chatList = document.getElementById(
    "all-chats-list"
  ) as HTMLUListElement;
  chatList.innerHTML = "";

  let History = localStorage.getItem("chatHistory");
  let AllMessages: Array<ARRAYOBJ>;
  if (History) {
    AllMessages = JSON.parse(History);
  } else {
    const all = await axios.get("http://localhost:6969/grpmsg/allmsg", {
      headers: { token: token, grouptoshow: currentGroup },
    });
    AllMessages = all.data.AllMessages;
    localStorage.setItem("chatHistory", JSON.stringify(AllMessages.slice(-30)));
  }

  if (AllMessages.length > 0) {
    lastMsgID = AllMessages[AllMessages.length - 1].id;
  } else {
    lastMsgID = 0;
  }

  localStorage.setItem("lastMsgID", `${lastMsgID}`);

  for (let i = 0; i < AllMessages.length; i++) {
    chatDisplay(AllMessages[i] as DISPLAYOBJ);
  }

  const scrollableDiv = document.getElementById("chats-div") as HTMLDivElement;

  scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
}

function displayFileName() {
  var fileInput = document.getElementById("file") as any;
  var fileNameDisplay = document.getElementById(
    "file-name-display"
  ) as HTMLSpanElement;

  if (fileInput?.files?.length > 0) {
    fileNameDisplay.innerText = fileInput.files[0].name;
  } else {
    fileNameDisplay.innerText = "";
  }
}

async function displayLatestMessages(group: string) {
  const latest = await axios.get("http://localhost:6969/home/getlatest", {
    headers: { token: TOKEN, group: group },
  });
  const msg = latest.data.latest[0];
  if (!msg){
    return
  }

  const LI = document.getElementById(group) as HTMLLIElement;
  const place = LI.children[1];

  let sender;
  console.log("idhat check karo ASYNC :", msg.id, msg.sender);
  if (ChatUser === msg.sender) {
    sender = "You";
  } else {
    sender = msg.sender;
  }

  if (msg.fileName) {
    place.innerHTML = `${sender} : ${msg.fileName}`;
  } else {
    place.innerHTML = `${sender} : ${msg.message}`;
  }

  return
}
