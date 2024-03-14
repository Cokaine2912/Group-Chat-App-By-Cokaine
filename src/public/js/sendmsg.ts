interface DISPLAYOBJ{
    message : string,
    sender : string,
    time : any
}

async function ONLOAD() {
    const token = localStorage.getItem("token")
    const all = await axios.get("http://localhost:6969/grpmsg/allmsg",{headers : {token : token}})

    const AllMessages: Array<object> = all.data.AllMessages
   
    for (let i = 0 ; i < AllMessages.length ; i++){
        chatDisplay(AllMessages[i] as DISPLAYOBJ)
    }
}
ONLOAD()

function chatDisplay(obj : DISPLAYOBJ) {
    const sender = obj.sender
    const message = obj.message
    const time = obj.time

    const chatList = document.getElementById("all-chats-list")
    const newChatItem = document.createElement("li")
    newChatItem.className = "chat-item"
    newChatItem.innerHTML = `<label for="" class="${sender}-msg">${sender} :</label>
    <p>${message}</p><p>${new Date().toLocaleTimeString()}</p>`
    chatList?.appendChild(newChatItem)

}



async function SENDMSG(event: any) {
    event.preventDefault()
    const msg : string = event.target.chatmsg.value ;
    const token = localStorage.getItem("token")
    const obj = {msg : msg}
    const op = await axios.post("http://localhost:6969/grpmsg/postmsg",obj,{headers : {token : token}})
    chatDisplay(op.data)
    // const message = op.data.message
    // const sender = op.data.sender
    // const time = op.data.time
    // console.log("Message ready for DOM M",sender,message,time)
    // /// DOM Manipulations accordingly

    // const chatList = document.getElementById("all-chats-list")
    // const newChatItem = document.createElement("li")
    // newChatItem.className = "chat-item"
    // newChatItem.innerHTML = `<label for="" class="${sender}-msg">${sender} :</label>
    // <p>${message}</p><p>${new Date().toLocaleTimeString()}</p>`
    // chatList?.appendChild(newChatItem)
}