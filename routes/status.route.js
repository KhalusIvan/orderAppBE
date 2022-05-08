const express = require('express');

const { 
  getStatuses, 
 } = require("../controller/status.controller"); 

const statusRoutes = express.Router();

statusRoutes.get('/', getStatuses);

module.exports = statusRoutes;

