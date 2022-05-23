const express = require("express");

const {
  getOrders,
  getOrderStatistics,
  createOrder,
  updateOrderById,
  finishOrderById,
  deleteOrder,
} = require("../controller/order.controller");

const orderRoutes = express.Router();

orderRoutes.get("/", getOrders);
orderRoutes.get("/statistic", getOrderStatistics);
orderRoutes.post("/create", createOrder);
orderRoutes.post("/:id/update", updateOrderById);
orderRoutes.post("/:id/finish", finishOrderById);
orderRoutes.delete("/:id", deleteOrder);

module.exports = orderRoutes;
