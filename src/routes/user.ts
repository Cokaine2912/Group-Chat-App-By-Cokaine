const express = require("express");
import path from "path";

const router = express.Router();

const userController = require("../controllers/user")





router.get("/", (req: any, res: any) => {
    const filePath = path.join(__dirname, "../public/views/signup.html");
    console.log(filePath)
    res.sendFile(filePath)
})

router.post("/adduser", userController.postNewUser)

module.exports = router;