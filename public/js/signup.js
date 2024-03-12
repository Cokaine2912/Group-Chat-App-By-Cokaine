function SIGNUP(event) {
  event.preventDefault();
  const obj = {
    username: event.target.username.value,
    email: event.target.email.value,
    phone: event.target.phone.value,
    password: event.target.password.value,
  };

  console.log("Obj Received :", obj);
}
