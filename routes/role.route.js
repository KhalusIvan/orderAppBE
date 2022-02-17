const express = require('express');

const { 
  getRoles, 
  getRoleById,
  createRole,
  updateRoleById,
  deleteRoleById,
 } = require("../controller/role.controller"); 

const roleRoutes = express.Router();

roleRoutes.get('/', getRoles);
roleRoutes.get('/:id', getRoleById);
roleRoutes.post('/create', createRole);
roleRoutes.post('/:id/update', updateRoleById);
roleRoutes.delete('/:id', deleteRoleById);

module.exports = roleRoutes;

