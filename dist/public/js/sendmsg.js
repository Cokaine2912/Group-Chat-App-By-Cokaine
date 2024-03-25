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
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "./login.html";
}
const AWS = WINDOW.AWS;
AWS.config.update({ region: "ap-south-1" });
const pageTitle = document.getElementById("pageTitle");
const capacity = 30;
let currentGroup = localStorage.getItem("currentGroup");
let lastMsgID = 0;
function ONLOAD() {
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
function constantAPIcalls() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentGroup = localStorage.getItem("currentGroup");
        const lastMsgID = localStorage.getItem("lastMsgID");
        const op = yield axios.get(`http://13.201.21.152:6969/grpmsg/getlatest/${lastMsgID}`, { headers: { token: token, grouptoshow: currentGroup } });
        const status = op.data.status;
        const LatestMessages = op.data.LatestMessages;
        if (LatestMessages.length > 0) {
            const NumberOfLatest = LatestMessages.length;
            const toKeep = capacity - NumberOfLatest;
            for (let i = 0; i < LatestMessages.length; i++) {
                chatDisplay(LatestMessages[i]);
                ScrollDown();
            }
            localStorage.setItem("lastMsgID", `${LatestMessages[LatestMessages.length - 1].id}`);
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
    });
}
function ScrollDown() {
    const scrollableDiv = document.getElementById("chats-div");
    scrollableDiv.scrollTo({
        top: scrollableDiv.scrollHeight,
        behavior: "smooth",
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
    const fileUrl = obj.fileUrl;
    const fileName = obj.fileName;
    const date = new Date(time);
    const dateTime = date.toLocaleTimeString();
    const chatList = document.getElementById("all-chats-list");
    const newChatItem = document.createElement("li");
    newChatItem.className = "chat-item";
    newChatItem.style.marginLeft = `${margin}%`;
    if (fileUrl) {
        newChatItem.innerHTML = `<label for="" class="${sender}-msg">${sender} :</label>
    <div class = "file-showing-div" ><a href = "${fileUrl}" class ="fileUrl-link">${fileName}</a></div>
    <p>${message}</p><div class="msg-time-div" style="text-align: end;">${dateTime}</div>`;
    }
    else {
        newChatItem.innerHTML = `<label for="" class="${sender}-msg">${sender} :</label>
    <p>${message}</p><div class="msg-time-div" style="text-align: end;">${dateTime}</div>`;
    }
    chatList === null || chatList === void 0 ? void 0 : chatList.appendChild(newChatItem);
}
function SENDMSG(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentGroup = localStorage.getItem("currentGroup");
        event.preventDefault();
        const fileInput = document.getElementById("file");
        const file = fileInput.files ? fileInput.files[0] : null;
        let fileNameToShow;
        if (file) {
            fileNameToShow = file.name;
        }
        const msg = event.target.chatmsg.value;
        if (!msg && !file) {
            return;
        }
        const token = localStorage.getItem("token");
        // let obj = { msg: msg, toGroup: currentGroup };
        const obj = {
            msg: msg,
            toGroup: currentGroup,
        };
        try {
            let uploadUrl;
            if (file) {
                const fileData = yield readFileAsArrayBuffer(file);
                const filename = "GroupChatApp/" + `${new Date().toTimeString()}` + file.name;
                const FORMDATA = new FormData();
                FORMDATA.append("file", file);
                FORMDATA.append("filename", filename);
                const NEW = yield axios.post("http://13.201.21.152:6969/grpmsg/uploadfile", FORMDATA, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        token: token,
                        grouptoshow: currentGroup,
                    },
                });
                uploadUrl = NEW.data.URL;
                obj.fileUrl = uploadUrl;
                obj.fileName = fileNameToShow;
            }
            const op = yield axios.post("http://13.201.21.152:6969/grpmsg/postmsg", obj, {
                headers: { token: token },
            });
            const History = localStorage.getItem("chatHistory");
            if (History) {
                let chatHistory = JSON.parse(History);
                chatHistory = chatHistory.slice(-1 * (capacity - 1));
                chatHistory.push(op.data);
                localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
            }
            if (msg || file) {
                const chatUser = localStorage.getItem("ChatUser");
                const groupName = currentGroup;
                socket.emit("chat message", {
                    sender: chatUser,
                    to: groupName,
                    msg: msg,
                });
            }
            const msgBox = document.getElementById("chat-msg");
            msgBox.value = "";
            const tempFile = document.getElementById("file-name-display");
            tempFile.innerHTML = "";
        }
        catch (err) {
            console.log(err);
            alert("Something Went Wrong !");
        }
    });
}
function REMOVEMEMBER(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const currentGroup = localStorage.getItem("currentGroup");
        let toRemoveId = event.target.parentElement.id.split("-");
        toRemoveId = toRemoveId[0];
        const obj = { toRemoveId: toRemoveId };
        try {
            const op = yield axios.post("http://13.201.21.152:6969/grpmsg/removemember", obj, {
                headers: { token: token, grouptoshow: currentGroup },
            });
            const liToRemove = document.getElementById(`${toRemoveId}-list-item`);
            liToRemove.remove();
        }
        catch (error) {
            console.log(error);
            alert("Something Went Wrong !");
        }
    });
}
function MAKEADMIN(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        let toMakeId = event.target.parentElement.id.split("-");
        toMakeId = toMakeId[0];
        const obj = { toMakeId: toMakeId };
        try {
            const op = yield axios.post("http://13.201.21.152:6969/grpmsg/makeadmin", obj, {
                headers: { token: token, grouptoshow: currentGroup },
            });
            if (op.data.success) {
                const statusDiv = document.getElementById(`${toMakeId}-member-status`);
                statusDiv.innerHTML = "Admin";
            }
            event.target.remove();
        }
        catch (error) {
            console.log(error);
            alert("Something Went Wrong !");
        }
    });
}
socket.on("chat message", (obj) => {
    const msg = obj.msg;
    const sender = obj.sender;
    const groupName = obj.to;
    let currentGroup = localStorage.getItem("currentGroup");
    if (currentGroup === groupName) {
        constantAPIcalls();
    }
    upadteLatestMsg(obj);
});
socket.on("update own", (obj) => {
    constantAPIcalls();
});
socket.on("update home", (dummy) => {
    HOMELOAD();
});
socket.on("HOMELOAD", (dummy) => {
    HOMELOAD();
});
socket.on("join alert", (joinOBJ) => {
    console.log(`${joinOBJ.chatUser} joined ${joinOBJ.room} with ${joinOBJ.socketId}`);
});
socket.on("online info", (obj) => {
    const currentGroup = localStorage.getItem("currentGroup");
    if (obj.room === currentGroup) {
        join(obj.user);
    }
});
function join(member) {
    const UL = document.getElementById("all-chats-list");
    if (!UL) {
        return;
    }
    const joinli = document.createElement("li");
    joinli.className = "joinleft-li";
    joinli.innerHTML = `${member} joined`;
    UL.appendChild(joinli);
    ScrollDown();
}
function upadteLatestMsg(obj) {
    const msg = obj.msg;
    const sender = obj.sender;
    const groupName = obj.to;
    const toUpdate = document.getElementById(groupName);
    const test = toUpdate.children;
    test[1].innerHTML = `${sender.split(" ")[0]} : ${msg}`;
}
function readFileAsArrayBuffer(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && event.target.result) {
                    resolve(event.target.result);
                }
                else {
                    reject(new Error("Error reading file"));
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    });
}
function uploadToS3(data, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const BUCKET_NAME = "cokaineexpensetracker";
        const AWScreds = (yield axios.get("http://13.201.21.152:6969/creds/getConfig"));
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
            s3bucket.upload(params, (err, res) => {
                if (err) {
                    console.log("Something went wrong !", err);
                    reject(err);
                }
                else {
                    console.log("Success", res);
                    resolve(res.Location);
                }
            });
        });
    });
}
