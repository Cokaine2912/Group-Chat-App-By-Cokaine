const express = require("express");

const router = express.Router();

router.get("/",(req,res,next)=>{
    console.log("First Test Route")
    return res.json({msg:"Check"})
})

module.exports = router;