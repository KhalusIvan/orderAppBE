const express = require("express");

const {
  getOrders,
  createOrder,
  updateOrderById,
  deleteOrder,
} = require("../controller/order.controller");

const orderRoutes = express.Router();

orderRoutes.get("/", getOrders);
orderRoutes.post("/create", createOrder);
orderRoutes.post("/:id/update", updateOrderById);
orderRoutes.delete("/:id", deleteOrder);

module.exports = orderRoutes;
