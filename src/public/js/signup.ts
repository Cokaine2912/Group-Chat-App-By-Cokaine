/// <reference types="axios" />
declare const axios: any;

interface OBJ {
  username: string,
  email: string,
  phone: string,
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
