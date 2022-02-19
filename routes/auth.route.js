const express = require("express");

const {
  registration,
  signIn,
  resetPassword,
} = require("../controller/auth.controller");

const itemRoutes = express.Router();

itemRoutes.post("/register", registration);
itemRoutes.post("/sign-in", signIn);
itemRoutes.post("/reset-password", resetPassword);

module.exports = itemRoutes;
