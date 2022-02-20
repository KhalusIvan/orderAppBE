const express = require("express");

const {
  getManufacturers,
  createManufacturer,
  updateManufacturerById,
  deleteManufacturer,
} = require("../controller/manufacturer.controller");

const manufacturerRoutes = express.Router();

manufacturerRoutes.get("/", getManufacturers);
manufacturerRoutes.post("/create", createManufacturer);
manufacturerRoutes.post("/:id/update", updateManufacturerById);
manufacturerRoutes.delete("/:id", deleteManufacturer);

module.exports = manufacturerRoutes;
