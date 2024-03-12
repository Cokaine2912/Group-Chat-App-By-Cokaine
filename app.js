const cors = require("cors");

const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./util/database");


const User = require("./models/user");

const userRoutes = require("./routes/user")

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: true }));

app.use(userRoutes);


sequelize
  .sync()
  .then((result) => {
    app.listen(6969);
  })
  .catch((err) => {
    console.log(err);
  });