const express = require("express");

const {
  registration,
  signIn,
  resetPassword,
  confirmation,
  confirmPassword,
} = require("../controller/auth.controller");

const itemRoutes = express.Router();

itemRoutes.post("/register", registration);
itemRoutes.post("/sign-in", signIn);
itemRoutes.post("/reset-password", resetPassword);
itemRoutes.post("/confirm-password", confirmPassword);
itemRoutes.post("/confirmation", confirmation);

module.exports = itemRoutes;
