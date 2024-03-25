const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "./login.html";
}

const AWS = WINDOW.AWS as any;
AWS.config.update({ region: "ap-south-1" });

const pageTitle = document.getElementById("pageTitle");

const capacity = 30;

let currentGroup = localStorage.getItem("currentGroup");

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
    const all = await axios.get("http://13.201.21.152:6969/grpmsg/allmsg", {
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

async function constantAPIcalls() {
  const currentGroup = localStorage.getItem("currentGroup");
  const lastMsgID = localStorage.getItem("lastMsgID");
  const op = await axios.get(
    `http://13.201.21.152:6969/grpmsg/getlatest/${lastMsgID}`,
    { headers: { token: token, grouptoshow: currentGroup } }
  );
  const status = op.data.status;

  const LatestMessages = op.data.LatestMessages;

  if (LatestMessages.length > 0) {
    const NumberOfLatest = LatestMessages.length;
    const toKeep = capacity - NumberOfLatest;

    for (let i = 0; i < LatestMessages.length; i++) {
      chatDisplay(LatestMessages[i]);
      ScrollDown();
    }

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
  if (currentGroup) {
    displayLatestMessages(currentGroup);
  }
}

function ScrollDown() {
  const scrollableDiv = document.getElementById("chats-div") as HTMLDivElement;
  scrollableDiv.scrollTo({
    top: scrollableDiv.scrollHeight,
    behavior: "smooth",
  });
}

function chatDisplay(obj: any) {
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
  const fileUrl = obj.fileUrl;
  const fileName = obj.fileName;
  const date = new Date(time);
  const dateTime = date.toLocaleTimeString();

  const chatList = document.getElementById("all-chats-list");
  const newChatItem = document.createElement("li") as HTMLLIElement;
  newChatItem.className = "chat-item";
  newChatItem.style.marginLeft = `${margin}%`;

  if (fileUrl) {
    newChatItem.innerHTML = `<label for="" class="${sender}-msg">${sender} :</label>
    <div class = "file-showing-div" ><a href = "${fileUrl}" class ="fileUrl-link">${fileName}</a></div>
    <p>${message}</p><div class="msg-time-div" style="text-align: end;">${dateTime}</div>`;
  } else {
    newChatItem.innerHTML = `<label for="" class="${sender}-msg">${sender} :</label>
    <p>${message}</p><div class="msg-time-div" style="text-align: end;">${dateTime}</div>`;
  }

  chatList?.appendChild(newChatItem);
}

async function SENDMSG(event: any) {
  const currentGroup = localStorage.getItem("currentGroup");
  event.preventDefault();

  const fileInput = document.getElementById("file") as HTMLInputElement;

  const file = fileInput.files ? fileInput.files[0] : null;
  let fileNameToShow;
  if (file) {
    fileNameToShow = file.name;
  }
  const msg: string = event.target.chatmsg.value;

  if (!msg && !file) {
    return;
  }

  const token = localStorage.getItem("token");
  // let obj = { msg: msg, toGroup: currentGroup };
  const obj: {
    msg: string;
    toGroup: string | null;
    fileUrl?: any;
    fileName?: any;
  } = {
    msg: msg,
    toGroup: currentGroup,
  };

  try {
    let uploadUrl;

    if (file) {
      const fileData = await readFileAsArrayBuffer(file);
      const filename =
        "GroupChatApp/" + `${new Date().toTimeString()}` + file.name;

      const FORMDATA = new FormData();
      FORMDATA.append("file", file);
      FORMDATA.append("filename", filename);

      const NEW = await axios.post(
        "http://13.201.21.152:6969/grpmsg/uploadfile",
        FORMDATA,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
            grouptoshow: currentGroup,
          },
        }
      );

      uploadUrl = NEW.data.URL;

      obj.fileUrl = uploadUrl;
      obj.fileName = fileNameToShow;
    }

    const op = await axios.post(
      "http://13.201.21.152:6969/grpmsg/postmsg",
      obj,
      {
        headers: { token: token },
      }
    );

    const History = localStorage.getItem("chatHistory");
    if (History) {
      let chatHistory = JSON.parse(History);
      chatHistory = chatHistory.slice(-1 * (capacity - 1));
      chatHistory.push(op.data);
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }

    if (msg || file) {
      const chatUser = localStorage.getItem("ChatUser") as string;
      const groupName = currentGroup;
      socket.emit("chat message", {
        sender: chatUser,
        to: groupName,
        msg: msg,
      });
    }

    const msgBox = document.getElementById("chat-msg") as HTMLTextAreaElement;
    msgBox.value = "";
    const tempFile = document.getElementById(
      "file-name-display"
    ) as HTMLSpanElement;
    tempFile.innerHTML = "";
  } catch (err) {
    console.log(err);
    alert("Something Went Wrong !");
  }
}

async function REMOVEMEMBER(event: any) {
  event.preventDefault();
  const currentGroup = localStorage.getItem("currentGroup");
  let toRemoveId = event.target.parentElement.id.split("-");
  toRemoveId = toRemoveId[0];
  const obj = { toRemoveId: toRemoveId };

  try {
    const op = await axios.post(
      "http://13.201.21.152:6969/grpmsg/removemember",
      obj,
      {
        headers: { token: token, grouptoshow: currentGroup },
      }
    );

    const liToRemove = document.getElementById(
      `${toRemoveId}-list-item`
    ) as HTMLLIElement;
    liToRemove.remove();
  } catch (error) {
    console.log(error);
    alert("Something Went Wrong !");
  }
}

async function MAKEADMIN(event: any) {
  event.preventDefault();
  let toMakeId = event.target.parentElement.id.split("-");
  toMakeId = toMakeId[0];

  const obj = { toMakeId: toMakeId };

  try {
    const op = await axios.post(
      "http://13.201.21.152:6969/grpmsg/makeadmin",
      obj,
      {
        headers: { token: token, grouptoshow: currentGroup },
      }
    );
    if (op.data.success) {
      const statusDiv = document.getElementById(
        `${toMakeId}-member-status`
      ) as HTMLDivElement;
      statusDiv.innerHTML = "Admin";
    }
    event.target.remove();
  } catch (error) {
    console.log(error);
    alert("Something Went Wrong !");
  }
}

socket.on("chat message", (obj: any) => {
  const msg = obj.msg;
  const sender = obj.sender;
  const groupName = obj.to;

  let currentGroup = localStorage.getItem("currentGroup");
  if (currentGroup === groupName) {
    constantAPIcalls();
  }
  upadteLatestMsg(obj);
});

socket.on("update own", (obj: any) => {
  constantAPIcalls();
});

socket.on("update home", (dummy: any) => {
  HOMELOAD();
});

socket.on("HOMELOAD", (dummy: any) => {
  HOMELOAD();
});

socket.on("join alert", (joinOBJ: any) => {
  console.log(
    `${joinOBJ.chatUser} joined ${joinOBJ.room} with ${joinOBJ.socketId}`
  );
});

socket.on("online info", (obj: any) => {
  const currentGroup = localStorage.getItem("currentGroup");
  if (obj.room === currentGroup) {
    join(obj.user);
  }
});

function join(member: string) {
  const UL = document.getElementById("all-chats-list") as HTMLUListElement;
  if (!UL) {
    return;
  }
  const joinli = document.createElement("li");
  joinli.className = "joinleft-li";
  joinli.innerHTML = `${member} joined`;
  UL.appendChild(joinli);

  ScrollDown();
}

function upadteLatestMsg(obj: any) {
  const msg = obj.msg;
  const sender = obj.sender;
  const groupName = obj.to;
  const toUpdate = document.getElementById(groupName) as any;
  const test = toUpdate.children;
  test[1].innerHTML = `${sender.split(" ")[0]} : ${msg}`;
}

async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        resolve(event.target.result as ArrayBuffer);
      } else {
        reject(new Error("Error reading file"));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
}

async function uploadToS3(data: any, filename: any) {
  const BUCKET_NAME = "cokaineexpensetracker";

  const AWScreds = (await axios.get(
    "http://13.201.21.152:6969/creds/getConfig"
  )) as any;

  const IAM_USER_KEY = AWScreds.data.IAM_USER_KEY;
  const IAM_USER_SECRET = AWScreds.data.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME,
  });
  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err: any, res: any) => {
      if (err) {
        console.log("Something went wrong !", err);
        reject(err);
      } else {
        console.log("Success", res);
        resolve(res.Location);
      }
    });
  });
}
