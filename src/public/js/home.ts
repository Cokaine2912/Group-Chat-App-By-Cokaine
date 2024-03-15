const TOKEN = localStorage.getItem("token");

async function TakeToGroup(event: any) {
  event.preventDefault();
  console.log(event.target.id);

  const GroupToShow = event.target.id;

  // const all = await axios.get(`http://localhost:6969/grpmsg/${GroupToShow}`, {
  //   headers: { token: TOKEN, GroupToShow: GroupToShow },
  // });

  const all = await axios.get("http://localhost:6969/grpmsg/allmsg", {
    headers: { token: TOKEN, grouptoshow: GroupToShow },
  });

  console.log(all.data);
  const currentGroup = all.data.currentGroup;
  localStorage.setItem("currentGroup", currentGroup);

  const AllMessages = all.data.AllMessages;
  localStorage.setItem("chatHistory", JSON.stringify(AllMessages.slice(-30)));

  window.location.href = "./chat.html";
}

function DISPLAYGROUP(obj: any) {
  const ul = document.getElementById("all-groups-list") as HTMLUListElement;
  const newli = document.createElement("li");
  newli.innerHTML = `<li class = "group-list-item"><a class = "group-link-a" id = "${obj.groupName}" onclick = "TakeToGroup(event)">${obj.groupName}</a></li>`;
  ul.appendChild(newli);
}

async function HOMELOAD() {
  const op = await axios.get("http://localhost:6969/home/allgrps", {
    headers: { token: TOKEN },
  });
  const AllGroupsForThisUser = op.data.AllGroupsForThisUser;

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
