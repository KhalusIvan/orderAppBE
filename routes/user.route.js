const express = require("express");

const {
  confirmation,
  confirmPassword,
  check,
} = require("../controller/user.controller");

const itemRoutes = express.Router();

itemRoutes.post("/check", check);
itemRoutes.post("/confirm-password", confirmPassword);
itemRoutes.post("/confirmation", confirmation);

module.exports = itemRoutes;