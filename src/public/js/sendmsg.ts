interface DISPLAYOBJ {
    message: string,
    sender: string,
    createdAt: any
}

async function ONLOAD() {
    const chatList = document.getElementById("all-chats-list") as HTMLUListElement
    chatList.innerHTML = ""
    const token = localStorage.getItem("token")
    const all = await axios.get("http://localhost:6969/grpmsg/allmsg", { headers: { token: token } })

    const AllMessages: Array<object> = all.data.AllMessages

    for (let i = 0; i < AllMessages.length; i++) {
        chatDisplay(AllMessages[i] as DISPLAYOBJ)
        // ScrollDown()
    }

    const scrollableDiv = document.getElementById('chats-div') as HTMLDivElement

    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
}
setTimeout(ONLOAD, 0)
setInterval(ONLOAD, 10000)
// ONLOAD()


function ScrollDown() {
    const scrollableDiv = document.getElementById('chats-div') as HTMLDivElement
    scrollableDiv.scrollTo({
        top: scrollableDiv.scrollHeight,
        behavior: 'smooth'
    });
}

function chatDisplay(obj: DISPLAYOBJ) {
    const sender = obj.sender
    const message = obj.message
    const time = obj.createdAt
    const date = new Date(time);
    const dateTime = date.toLocaleTimeString().replace('Z', '');

    const chatList = document.getElementById("all-chats-list")
    const newChatItem = document.createElement("li")
    newChatItem.className = "chat-item"
    newChatItem.innerHTML = `<label for="" class="${sender}-msg">${sender} :</label>
    <p>${message}</p><p>${dateTime}</p>`
    chatList?.appendChild(newChatItem)

}



async function SENDMSG(event: any) {
    event.preventDefault()
    const msg: string = event.target.chatmsg.value;
    const token = localStorage.getItem("token")
    const obj = { msg: msg }
    const op = await axios.post("http://localhost:6969/grpmsg/postmsg", obj, { headers: { token: token } })
    chatDisplay(op.data)
    ScrollDown()
    const msgBox = document.getElementById("chat-msg") as HTMLTextAreaElement
    msgBox.value = ""
}