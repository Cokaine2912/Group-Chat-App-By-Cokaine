import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import sequelize  from './util/database';

// const sequelize = require("./util/database")
const User = require("./models/user")
const userRoutes = require("./routes/user")

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(userRoutes);


app.get("/css/:file",(req:any,res:any)=>{
  const file = req.params.file
  const fp = path.join(__dirname,`./public/css/${file}`)
  res.sendFile(fp)
})

console.log("Start at : ",new Date().toLocaleTimeString())
sequelize
  .sync()
  .then(() => {
    app.listen(6969);
  })
  .catch((err: any) => {
    console.log(err);
  });