const express = require("express");

const {
  getCustomers,
  createCustomer,
  updateCustomerById,
  deleteCustomer,
} = require("../controller/customer.controller");

const customerRoutes = express.Router();

customerRoutes.get("/", getCustomers);
customerRoutes.post("/create", createCustomer);
customerRoutes.post("/:id/update", updateCustomerById);
customerRoutes.delete("/:id", deleteCustomer);

module.exports = customerRoutes;
