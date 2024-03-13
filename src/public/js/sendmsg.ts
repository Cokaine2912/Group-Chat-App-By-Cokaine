async function SENDMSG(event: any) {
    event.preventDefault()
    const msg : string = event.target.chatmsg.value ;
    const token = localStorage.getItem("token")
    const obj = {token : token , msg : msg}
    const op = await axios.post("http://localhost:6969/grpmsg/postmsg",obj)

    console.log(op.data)
    const message = op.data.message
    const sender = op.data.sender
    const time = op.data.time
    console.log("Message ready for DOM M",sender,message,time)
    /// DOM Manipulations accordingly

    const chatList = document.getElementById("all-chats-list")
    const newChatItem = document.createElement("li")
    newChatItem.className = "chat-item"
    newChatItem.innerHTML = `<label for="" class="${sender}-msg">${sender} :</label>
    <p>${message}</p>`
    chatList?.appendChild(newChatItem)
}