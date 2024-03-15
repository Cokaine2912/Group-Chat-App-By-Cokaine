const TOKEN = localStorage.getItem("token");

async function HOMELOAD() {
  const op = await axios.get("http://localhost:6969/home/allgrps", {
    headers: { token: TOKEN },
  });
  const AllGroupsForThisUser = op.data.AllGroupsForThisUser;
}
HOMELOAD();

async function CREATEGROUP(event: any) {
  event.preventDefault();
  const obj = {
    GroupName: event.target.name.value,
    NewMemberEmail: event.target.email.value,
  };
  console.log(obj);

  const op = await axios.post("http://localhost:6969/home/creategrp", obj, {
    headers: { token: TOKEN },
  });

  console.log(op.data);
}
