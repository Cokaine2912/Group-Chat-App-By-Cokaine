const TOKEN = localStorage.getItem("token");

async function TakeToGroup(event: any) {
  event.preventDefault();

  setInterval(constantAPIcalls, 5000);

  const main = document.getElementById("main") as HTMLDivElement;

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

  // ADMIN Checking

  let AdminCheck = await axios.get("http://localhost:6969/grpmsg/admincheck", {
    headers: { token: TOKEN, grouptoshow: GroupToShow },
  });

  AdminCheck = AdminCheck.data;

  let AddButtonForAdmin = "";

  console.log("ADMIN CHECK  : ", AdminCheck.AdminCheck.isAdmin);

  if (AdminCheck.AdminCheck.isAdmin) {
    AddButtonForAdmin = `<button id="add-member-button">Group Info</button>`;
  }

  const chatHeader = document.getElementById("chat-header") as HTMLDivElement;
  chatHeader.innerHTML = `<h3 id="main-heading-h3">${GroupToShow}</h3>${AddButtonForAdmin}`;

  // const all = await axios.get(`http://localhost:6969/grpmsg/${GroupToShow}`, {
  //   headers: { token: TOKEN, GroupToShow: GroupToShow },
  // });

  const all = await axios.get("http://localhost:6969/grpmsg/allmsg", {
    headers: { token: TOKEN, grouptoshow: GroupToShow },
  });

  const currentGroup = all.data.currentGroup;
  localStorage.setItem("currentGroup", currentGroup);

  const AllMessages = all.data.AllMessages;
  localStorage.setItem("chatHistory", JSON.stringify(AllMessages.slice(-30)));

  const AddMemBtn = document.getElementById(
    "add-member-button"
  ) as HTMLButtonElement;
  if (AddMemBtn) {
    const PopupForm = document.getElementById("popupForm") as HTMLDivElement;
    const PopupFormHeading = document.getElementById(
      "popup-form-heading"
    ) as HTMLHeadingElement;
    PopupFormHeading.innerHTML = `${currentGroup}`;

    const GroupMemberList = document.getElementById("group-members-list");
    // let allMembers = await axios.get(
    //   "http://localhost:6969/grpmsg/getallmembers",
    //   {
    //     headers: { token: TOKEN, grouptoshow: GroupToShow },
    //   }
    // );

    // allMembers = allMembers.data

    // console.log(allMembers)

    const FixedGroupName = document.getElementById(
      "new-group-name"
    ) as HTMLInputElement;
    AddMemBtn.addEventListener("click", function () {
      console.log("Button clicked !!!");
      FixedGroupName.setAttribute("type", `hidden`);
      FixedGroupName.setAttribute("value", `${currentGroup}`);
      FixedGroupName.setAttribute("readonly", "true");
      PopupForm.style.display = "block";
    });
  }

  NewONLOAD();

  // window.location.href = "./chat.html";
}

function DISPLAYGROUP(obj: any) {
  const ul = document.getElementById("all-groups-list") as HTMLUListElement;
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

async function HOMELOAD() {
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
    }
  }
}
HOMELOAD();

async function CREATEGROUP(event: any) {
  event.preventDefault();
  const obj = {
    GroupName: event.target.name.value,
    NewMemberEmail: event.target.email.value,
  };

  const op = await axios.post("http://localhost:6969/home/creategrp", obj, {
    headers: { token: TOKEN },
  });

  console.log(op.data);
  alert(op.data.msg);
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
