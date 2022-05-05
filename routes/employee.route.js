const express = require("express");

const {
  getEmployees,
} = require("../controller/employee.controller");

const employeeRoutes = express.Router();

employeeRoutes.get("/", getEmployees);

module.exports = employeeRoutes;
