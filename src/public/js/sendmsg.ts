const token = localStorage.getItem("token");

const capacity = 30;

if (!token) {
  window.location.href = "./login.html";
} else {
  setTimeout(ONLOAD, 0);
  setInterval(constantAPIcalls, 30000);
}

interface DISPLAYOBJ {
  message: string;
  sender: string;
  createdAt: any;
}

interface ARRAYOBJ {
  id: number;
  sender: string;
  message: string;
  createdAt: any;
  updatedAt: any;
  userId: number;
}

let lastMsgID = 0;

async function ONLOAD() {
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
      headers: { token: token },
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

async function constantAPIcalls() {
  const lastMsgID = localStorage.getItem("lastMsgID");
  const op = await axios.get(
    `http://localhost:6969/grpmsg/getlatest/${lastMsgID}`,
    { headers: { token: token } }
  );
  const status = op.data.status;
  console.log(status);
  const LatestMessages = op.data.LatestMessages;

  if (LatestMessages.length > 0) {
    const NumberOfLatest = LatestMessages.length;
    const toKeep = capacity - NumberOfLatest;

    for (let i = 0; i < LatestMessages.length; i++) {
      chatDisplay(LatestMessages[i]);
      ScrollDown();
    }
    console.log(LatestMessages[LatestMessages.length - 1]);
    localStorage.setItem(
      "lastMsgID",
      `${LatestMessages[LatestMessages.length - 1].id}`
    );
    const History = localStorage.getItem("chatHistory");
    if (History) {
      let chatHistory = JSON.parse(History);

      chatHistory = chatHistory.slice(-1 * (capacity - NumberOfLatest));

      let newArray = chatHistory.concat(LatestMessages);
      localStorage.setItem("chatHistory", JSON.stringify(newArray));
    }
  }
}

function ScrollDown() {
  const scrollableDiv = document.getElementById("chats-div") as HTMLDivElement;
  scrollableDiv.scrollTo({
    top: scrollableDiv.scrollHeight,
    behavior: "smooth",
  });
}

function chatDisplay(obj: DISPLAYOBJ) {
  let sender;
  let margin;

  const ChatUser = localStorage.getItem("ChatUser");
  if (ChatUser === obj.sender) {
    sender = "You";
    margin = 18;
  } else {
    sender = obj.sender;
    margin = 2;
  }
  const message = obj.message;
  const time = obj.createdAt;
  const date = new Date(time);
  const dateTime = date.toLocaleTimeString();

  const chatList = document.getElementById("all-chats-list");
  const newChatItem = document.createElement("li") as HTMLLIElement;
  newChatItem.className = "chat-item";
  newChatItem.style.marginLeft = `${margin}%`;
  newChatItem.innerHTML = `<label for="" class="${sender}-msg">${sender} :</label>
    <p>${message}</p><div class="msg-time-div" style="text-align: end;">${dateTime}</div>`;
  chatList?.appendChild(newChatItem);
}

async function SENDMSG(event: any) {
  event.preventDefault();
  const msg: string = event.target.chatmsg.value;
  const token = localStorage.getItem("token");
  const obj = { msg: msg };
  const op = await axios.post("http://localhost:6969/grpmsg/postmsg", obj, {
    headers: { token: token },
  });
  let lastMsgID: any = localStorage.getItem("lastMsgID");
  let latest = +lastMsgID + 1;
  localStorage.setItem("lastMsgID", `${latest}`);

  const History = localStorage.getItem("chatHistory");
  if (History) {
    let chatHistory = JSON.parse(History);
    chatHistory = chatHistory.slice(-1 * (capacity - 1));
    chatHistory.push(op.data);
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }

  chatDisplay(op.data);
  ScrollDown();
  const msgBox = document.getElementById("chat-msg") as HTMLTextAreaElement;
  msgBox.value = "";
}
