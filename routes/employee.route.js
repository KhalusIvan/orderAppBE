const express = require('express')

const {
  getEmployees,
  createEmployee,
  updateEmployeeById,
  deleteEmployee,
} = require('../controller/employee.controller')

const employeeRoutes = express.Router()

employeeRoutes.get('/', getEmployees)
employeeRoutes.post('/create', createEmployee)
employeeRoutes.post('/:id/update', updateEmployeeById)
employeeRoutes.delete('/:id', deleteEmployee)

module.exports = employeeRoutes
