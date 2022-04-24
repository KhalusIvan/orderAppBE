const express = require('express')

const {
  confirmation,
  confirmPassword,
  check,
  setCurrentWorkspace,
} = require('../controller/user.controller')

const itemRoutes = express.Router()

itemRoutes.get('/check', check)
itemRoutes.post('/confirm-password', confirmPassword)
itemRoutes.post('/confirmation', confirmation)
itemRoutes.post('/current-workspace', setCurrentWorkspace)

module.exports = itemRoutes
