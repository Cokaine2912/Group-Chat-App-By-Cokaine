/// <reference types="axios" />
declare const axios: any;

interface OBJ {
  username: string,
  email: string,
  phone: string,
  password: string
}

interface LoginOBJ {
  email: string,
  password: string
}

async function SIGNUP(event: any) {
  event.preventDefault();
  const obj = {
    username: event.target.username.value,
    email: event.target.email.value,
    phone: event.target.phone.value,
    password: event.target.password.value,
  };

  const op = await axios.post("http://localhost:6969/adduser", obj as OBJ)

  alert(op.data.msg);

}

async function LOGIN(event: any) {
  event.preventDefault();
  const obj = {
    email: event.target.email.value,
    password: event.target.password.value
  }

  try {
    const op = await axios.post("http://localhost:6969/userlogin", obj as LoginOBJ)
    const res = op.data
    const token = res.token
    localStorage.setItem("token", token)
    window.location.href = "./chat.html";
    
  }
  catch (err: any) {
    return alert(err.response.data.msg)
  }

}
