const express = require('express');

const { 
  getWorkspaces, 
  createWorkspace,
  updateWorkspaceById,
 } = require("../controller/workspace.controller"); 

const workspaceRoutes = express.Router();

workspaceRoutes.get('/', getWorkspaces);
workspaceRoutes.post('/create', createWorkspace);
workspaceRoutes.post('/:id/update', updateWorkspaceById);

module.exports = workspaceRoutes;

