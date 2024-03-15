async function HOMELOAD() {

    const op = await axios.get("http://localhost:6969/home/allgrps", {
        headers: { token: token },
      });
    const AllGroupsForThisUser = op.data.AllGroupsForThisUser


}