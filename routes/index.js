const express = require('express')

const workspaceRoutes = require('./workspace.route')
const manufacturerRoutes = require('./manufacturer.route')
const itemRoutes = require('./item.route')
const customerRoutes = require('./customer.route')
const employeeRoutes = require('./employee.route')
const roleRoutes = require('./role.route')
const currencyRoutes = require('./currency.route')
const authRoutes = require('./auth.route')
const userRoutes = require('./user.route')

const router = express.Router()

router.use('/workspace', workspaceRoutes)
router.use('/manufacturer', manufacturerRoutes)
router.use('/customer', customerRoutes)
router.use('/employee', employeeRoutes)
router.use('/item', itemRoutes)
router.use('/role', roleRoutes)
router.use('/currency', currencyRoutes)
router.use('/auth', authRoutes)
router.use('/user', userRoutes)

module.exports = router
