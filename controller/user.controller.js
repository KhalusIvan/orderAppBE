const { User, Workspace, WorkspaceUser, Role, Sequelize } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')

const getUsers = async (req, res) => {
  try {
    let result
    const whereRequest = { id: { [Op.not]: req.user.id } }
    if (req.query.search) {
      whereRequest[Op.or] = [
        { firstName: { [Op.like]: `%${req.query.search}%` } },
        { lastName: { [Op.like]: `%${req.query.search}%` } },
        { email: { [Op.like]: `%${req.query.search}%` } },
      ]
    }
    if (req.query.page) {
      const limit = +process.env.ROWS_PER_PAGE
      const offset = (+req.query.page - 1) * +process.env.ROWS_PER_PAGE
      result = await User.findAndCountAll({
        /*include: [
          {
            model: Workspace,
            as: 'workspaces',
          },
        ],*/
        where: whereRequest,
        limit,
        offset,
        attributes: ['id', 'firstName', 'lastName', 'email'],
      })
      result.pages = Math.max(Math.ceil(result.count / limit), 1)
    } else {
      result = await User.findAll({
        /*include: [
          {
            model: Workspace,
            as: 'workspaces',
          },
        ],*/
        where: whereRequest,
        attributes: ['id', 'firstName', 'lastName', 'email'],
      })
    }
    return res.json(result)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}

const confirmation = async (req, res) => {
  try {
    await User.update(
      { confirm: true },
      {
        where: { id: req.user.id },
      },
    )
    return res.json({
      severity: 'success',
      text: 'Успішно підтверджено!',
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

const confirmPassword = async (req, res) => {
  try {
    if (!req.user.password) {
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })
    }
    bcrypt.hash(req.user.password, 10, async function (err, hash) {
      await User.update(
        { password: hash },
        {
          where: { id: req.user.id },
        },
      )
      return res.json({
        severity: 'success',
        text: 'Успішно змінений пароль!',
      })
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

const check = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: Workspace,
          as: 'currentWorkspace',
        },
      ],
    })
    if (!user) {
      return res.status(401).json({})
    }
    const role = await WorkspaceUser.findOne({
      where: { userId: req.user.id, workspaceId: user.currentWorkspace?.id || user.currentWorkspace.dataValues.id },
      attributes: [],
      include: [
        {
          model: Role,
          as: 'role',
        },
      ],
    })
    if (user) {
      return res.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          currentWorkspace: {
            ...user.currentWorkspace.dataValues,
            role: role.role,
          },
        },
      })
    } else {
      res.status(401).json({})
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}

const setCurrentWorkspace = async (req, res) => {
  try {
    await User.update(
      { currentWorkspaceId: req.body.workspaceId },
      {
        where: { id: req.user.id },
      },
    )
    const user = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: Workspace,
          as: 'currentWorkspace',
        },
      ],
    })
    const role = await WorkspaceUser.findOne({
      where: { userId: req.user.id, workspaceId: user.currentWorkspace.id },
      attributes: [],
      include: [
        {
          model: Role,
          as: 'role',
        },
      ],
    })
    return res.json({
      severity: 'success',
      text: 'Успішно вибрано!',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        currentWorkspace: {
          ...user.currentWorkspace.dataValues,
          role: role.role,
        },
      },
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

const changePassword = async (req, res) => {
  try {
    if (!req.body.prevPassword || !req.body.newPassword)
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })
    const user = await User.findOne({
      where: { id: req.user.id },
    })
    if (user && bcrypt.compareSync(req.body.prevPassword, user.password)) {
      bcrypt.hash(req.body.newPassword, 10, async function (err, hash) {
        await User.update(
          { password: hash },
          {
            where: { id: req.user.id },
          },
        )
      })
      return res.json({
        severity: 'success',
        text: 'Успішно змінено!',
      })
    } else {
      return res.status(406).json({
        severity: 'error',
        text: 'Не вірний попередній пароль!',
      })
    }
  } catch (err) {
    return res.status(500).json(err)
  }
}

const changeInfo = async (req, res) => {
  try {
    if (!req.body.firstName || !req.body.lastName || !req.body.email)
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })
    const sameEmail = await User.findOne({
      where: { id: { [Op.not]: req.user.id }, email: req.body.email },
    })
    if (sameEmail)
      return res.status(406).json({
        severity: 'error',
        text: 'Даний емейл зайнятий!',
      })
    await User.update(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      },
      {
        where: { id: req.user.id },
      },
    )
    const user = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: Workspace,
          as: 'currentWorkspace',
        },
      ],
    })
    const userRole = await WorkspaceUser.findOne({
      where: { userId: req.user.id, workspaceId: user.currentWorkspace.id },
      attributes: [],
      include: [
        {
          model: Role,
          as: 'role',
        },
      ],
    })
    return res.json({
      severity: 'success',
      text: 'Успішно оновлено!',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        currentWorkspace: {
          ...user.currentWorkspace.dataValues,
          role: userRole.role,
        },
      },
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

module.exports = {
  getUsers,
  confirmation,
  confirmPassword,
  check,
  setCurrentWorkspace,
  changePassword,
  changeInfo,
}
