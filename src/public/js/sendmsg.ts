interface DISPLAYOBJ {
    message: string,
    sender: string,
    createdAt: any
}

interface ARRAYOBJ {
    id : number,
    sender : string,
    message : string,
    createdAt : any,
    updatedAt : any,
    userId : number
}

let lastMsgID 

async function ONLOAD() {
    const chatList = document.getElementById("all-chats-list") as HTMLUListElement
    chatList.innerHTML = ""
    const token = localStorage.getItem("token")
    const all = await axios.get("http://localhost:6969/grpmsg/allmsg", { headers: { token: token } })

    const AllMessages: Array<ARRAYOBJ> = all.data.AllMessages
    
    localStorage.setItem("chatHistory" , JSON.stringify(AllMessages))

    lastMsgID = AllMessages[AllMessages.length - 1].id
    console.log(lastMsgID)
    for (let i = 0; i < AllMessages.length; i++) {
        chatDisplay(AllMessages[i] as DISPLAYOBJ)
        // ScrollDown()
    }

    const scrollableDiv = document.getElementById('chats-div') as HTMLDivElement

    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
}
setTimeout(ONLOAD, 0)
// setInterval(ONLOAD, 10000)
// ONLOAD()
async function constantAPIcalls(){

}


function ScrollDown() {
    const scrollableDiv = document.getElementById('chats-div') as HTMLDivElement
    scrollableDiv.scrollTo({
        top: scrollableDiv.scrollHeight,
        behavior: 'smooth'
    });
}

function chatDisplay(obj: DISPLAYOBJ) {
    let sender
    let margin

    const ChatUser = localStorage.getItem("ChatUser")
    if (ChatUser === obj.sender){
        sender = "You";
        margin = 18
    }
    else {
        sender = obj.sender
        margin = 2
    }
    const message = obj.message
    const time = obj.createdAt
    const date = new Date(time);
    const dateTime = date.toLocaleTimeString()

    const chatList = document.getElementById("all-chats-list")
    const newChatItem = document.createElement("li") as HTMLLIElement
    newChatItem.className = "chat-item"
    newChatItem.style.marginLeft = `${margin}%`
    newChatItem.innerHTML = `<label for="" class="${sender}-msg">${sender} :</label>
    <p>${message}</p><div class="msg-time-div" style="text-align: end;">${dateTime}</div>`
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

