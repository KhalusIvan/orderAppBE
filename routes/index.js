const express = require('express');

const workspaceRoutes = require("./workspace.route")
const roleRoutes = require("./role.route")
const authRoutes = require("./auth.route")

const router = express.Router();

router.use('/workspace', workspaceRoutes);
router.use('/role', roleRoutes);
router.use('/auth', authRoutes);

module.exports = router;