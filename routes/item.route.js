const express = require("express");

const {
  getItems,
  createItem,
  updateItemById,
  deleteItem,
} = require("../controller/item.controller");

const itemRoutes = express.Router();

itemRoutes.get("/", getItems);
itemRoutes.post("/create", createItem);
itemRoutes.post("/:id/update", updateItemById);
itemRoutes.delete("/:id", deleteItem);

module.exports = itemRoutes;
