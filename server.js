const dotenv = require("dotenv");
dotenv.config();

const routes = require("./routes");
const sequelize = require("./sequelize");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { middleware } = require("./controller/auth.controller");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use("/api", middleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", routes);

sequelize
  .authenticate()
  .then(async (res) => {
    await sequelize.sync({force: true});
    console.log("Connection has been established successfully.");
    app.listen(PORT, function () {
      console.log("Server is running on port: " + PORT);
    });
  })
  .catch((err) => console.log(err));
