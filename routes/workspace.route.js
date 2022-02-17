const express = require('express');

const { 
  getWorkspaces, 
  getWorkspaceById,
  createWorkspace,
  updateWorkspaceById,
  deleteWorkspaceById,
 } = require("../controller/workspace.controller"); 

const workspaceRoutes = express.Router();

workspaceRoutes.get('/', getWorkspaces);
workspaceRoutes.get('/:id', getWorkspaceById);
workspaceRoutes.post('/create', createWorkspace);
workspaceRoutes.post('/:id/update', updateWorkspaceById);
workspaceRoutes.delete('/:id', deleteWorkspaceById);

module.exports = workspaceRoutes;

