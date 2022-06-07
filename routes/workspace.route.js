const express = require('express')

const {
  getWorkspaces,
  createWorkspace,
  updateWorkspaceById,
  deleteWorkspace,
} = require('../controller/workspace.controller')

const workspaceRoutes = express.Router()

workspaceRoutes.get('/', getWorkspaces)
workspaceRoutes.post('/create', createWorkspace)
workspaceRoutes.post('/:id/update', updateWorkspaceById)
workspaceRoutes.delete('/:id', deleteWorkspace)

module.exports = workspaceRoutes
