const express = require('express');

const workspaceRoutes = require("./workspace.route")
const authRoutes = require("./auth.route")

const router = express.Router();

router.use('/workspace', workspaceRoutes);
router.use('/auth', authRoutes);

module.exports = router;