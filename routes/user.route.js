const express = require('express')

const {
  getUsers,
  confirmation,
  confirmPassword,
  check,
  setCurrentWorkspace,
  changePassword,
  changeInfo,
} = require('../controller/user.controller')

const itemRoutes = express.Router()

itemRoutes.get('/', getUsers)
itemRoutes.get('/check', check)
itemRoutes.post('/confirm-password', confirmPassword)
itemRoutes.post('/confirmation', confirmation)
itemRoutes.post('/current-workspace', setCurrentWorkspace)
itemRoutes.post('/change-password', changePassword)
itemRoutes.post('/change-information', changeInfo)

module.exports = itemRoutes
