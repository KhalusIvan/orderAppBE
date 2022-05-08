const { WorkspaceUser, Role, User, Sequelize } = require('../models')
const { Op } = require('sequelize')

const getEmployees = async (req, res) => {
  try {
    let result
    const whereWorkspace = {
      workspaceId: req.user.workspaceId,
      userId: { [Op.not]: req.user.id },
    }
    const whereRequestUser = {}
    if (req.query.search) {
      whereRequestUser[Op.or] = [
        { firstName: { [Op.like]: `%${req.query.search}%` } },
        { lastName: { [Op.like]: `%${req.query.search}%` } },
        { email: { [Op.like]: `%${req.query.search}%` } },
      ]
    }
    if (req.query.roleId) {
      const values = req.query.roleId.split(',')
      whereWorkspace.roleId =
        values.length === 1 ? values[0] : { [Op.or]: values }
    }
    if (req.query.page) {
      const limit = +process.env.ROWS_PER_PAGE
      const offset = (+req.query.page - 1) * +process.env.ROWS_PER_PAGE
      result = await WorkspaceUser.findAndCountAll({
        where: whereWorkspace,
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'user',
            where: whereRequestUser,
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
        limit,
        offset,
        attributes: ['id'],
      })
      if (req.query.filter) {
        const roleCount = await WorkspaceUser.findAll({
          include: [
            {
              model: Role,
              as: 'role',
              attributes: ['id', 'name'],
            },
          ],
          where: whereWorkspace,
          attributes: [[Sequelize.literal('COUNT(roleId)'), 'number']],
          group: 'roleId',
        })
        result.role = roleCount
      }
      result.pages = Math.max(Math.ceil(result.count / limit), 1)
    } else {
      result = await WorkspaceUser.findAll({
        where: whereWorkspace,
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'user',
            where: whereRequestUser,
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
        attributes: ['id'],
      })
    }
    return res.json(result)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}

const createEmployee = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.roleId)
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })
    const isUser = await User.findByPk(req.body.userId)
    const isRole = await Role.findByPk(req.body.roleId)
    if (!isUser || !isRole)
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })

    const workspaceId = req.user.workspaceId

    const sameUser = await WorkspaceUser.findOne({
      where: {
        userId: req.body.userId,
        workspaceId: workspaceId,
      },
    })

    if (sameUser)
      return res.status(406).json({
        severity: 'error',
        text: 'Даний юзер вже працює!',
      })
    const user = await WorkspaceUser.create({
      roleId: req.body.roleId,
      userId: req.body.userId,
      workspaceId,
    })
    return res.json({
      severity: 'success',
      text: 'Успішно додано!',
      user,
    })
  } catch (err) {
    return res.status(500).json({ err })
  }
}

const updateEmployeeById = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.roleId)
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })
    const isUser = await User.findByPk(req.body.userId)
    const isRole = await Role.findByPk(req.body.roleId)
    if (!isUser || !isRole)
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })

    const workspaceId = req.user.workspaceId

    const user = await WorkspaceUser.update(
      {
        roleId: req.body.roleId,
        userId: req.body.userId,
        workspaceId,
      },
      {
        where: { id: req.params.id },
      },
    )
    return res.json({
      severity: 'success',
      text: 'Успішно оновлено!',
      user,
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

const deleteEmployee = async (req, res) => {
  try {
    await WorkspaceUser.destroy({
      where: {
        id: req.params.id,
      },
    })
    return res.json({
      severity: 'success',
      text: 'Успішно видалено!',
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployeeById,
  deleteEmployee,
}
