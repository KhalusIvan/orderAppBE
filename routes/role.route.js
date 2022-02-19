const express = require('express');

const { 
  getRoles, 
 } = require("../controller/role.controller"); 

const roleRoutes = express.Router();

roleRoutes.get('/', getRoles);

module.exports = roleRoutes;

