const { User, Workspace, Sequelize } = require('../models')
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
      result.pages = Math.ceil(result.count / limit)
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

    if (user) {
      return res.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          currentWorkspace: user.currentWorkspace,
        },
      })
    } else {
      res.status(401).json({})
    }
  } catch (err) {
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
    return res.json({
      severity: 'success',
      text: 'Успішно вибрано!',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        currentWorkspace: user.currentWorkspace,
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
}
