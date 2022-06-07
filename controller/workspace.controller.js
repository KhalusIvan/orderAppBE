const {
  Workspace,
  Role,
  User,
  WorkspaceUser,
  OrderItem,
  Order,
  Customer,
  Item,
  Manufacturer,
} = require('../models')
const { Op } = require('sequelize')

const getWorkspaces = async (req, res) => {
  try {
    let result
    const whereRequest = { userId: req.user.id }
    const whereName = {}
    if (req.query.search) {
      whereName.name = { [Op.like]: `%${req.query.search}%` }
    }
    if (req.query.page) {
      const limit = +process.env.ROWS_PER_PAGE
      const offset = (+req.query.page - 1) * +process.env.ROWS_PER_PAGE
      result = await WorkspaceUser.findAndCountAll({
        include: [
          { model: Workspace, as: 'workspace', where: whereName },
          { model: Role, as: 'role', attributes: ['id', 'name'] },
        ],
        where: whereRequest,
        limit,
        offset,
        attributes: ['id'],
      })
      result.pages = Math.max(Math.ceil(result.count / limit), 1)
    } else {
      result = await WorkspaceUser.findAll({
        include: [
          { model: Workspace, as: 'workspace', where: whereName },
          { model: Role, as: 'role', attributes: ['id', 'name'] },
        ],
        where: whereRequest,
        attributes: ['id'],
      })
    }
    return res.json(result)
  } catch (err) {
    return res.status(500).json(err)
  }
}

const createWorkspace = async (req, res) => {
  try {
    if (!req.body.name)
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })
    const workspacePrev = await Workspace.findOne({
      where: { name: req.body.name },
    })
    if (workspacePrev)
      return res.status(406).json({
        severity: 'error',
        text: 'Дана назва використовується!',
      })
    const workspace = await Workspace.create({ name: req.body.name })
    const user = await User.findByPk(req.user.id)
    const role = await Role.findOne({ where: { owner: true } })
    await WorkspaceUser.create({
      userId: user.id,
      roleId: role.id,
      workspaceId: workspace.id,
    })
    await User.update(
      { currentWorkspaceId: workspace.id },
      {
        where: { id: req.user.id },
      },
    )
    return res.json({
      severity: 'success',
      text: 'Успішно додано!',
      workspace,
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

const updateWorkspaceById = async (req, res) => {
  try {
    if (!req.body.name)
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })
    const sameName = await Workspace.findOne({
      where: { id: { [Op.not]: req.params.id }, name: req.body.name },
    })
    if (sameName)
      return res.status(406).json({
        severity: 'error',
        text: 'Дана назва використовується!',
      })
    const workspace = await Workspace.update(
      { name: req.body.name },
      {
        where: { id: req.params.id },
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
    if (+user.currentWorkspace.id === +req.params.id) {
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
        text: 'Успішно видалено!',
        workspace,
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
    }
    return res.json({
      severity: 'success',
      text: 'Успішно оновлено!',
      workspace,
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

const deleteWorkspace = async (req, res) => {
  try {
    const role = await Role.findOne({ where: { owner: true } })
    const workspaceRole = await WorkspaceUser.findOne({
      where: { workspaceId: req.user.workspaceId, userId: req.user.id },
      attributes: ['roleId'],
    })
    if (role.id === workspaceRole.roleId) {
      result = await WorkspaceUser.findAndCountAll({
        where: { userId: req.user.id, roleId: role.id },
        attributes: ['id'],
      })
      if (result.count === 1) {
        return res.status(406).json({
          severity: 'error',
          text: 'Не можна видалити єдиний власний простір!',
        })
      }

      await OrderItem.findAll({
        attributes: ['id'],
        include: [
          { model: Order, as: 'order', where: { workspaceId: req.params.id } },
        ],
        raw: true,
      }).then(async function (items) {
        const itemIds = items.map((el) => el.id)
        if (itemIds.length === 0) return Promise.resolve(true) //nothing to delete
        await OrderItem.destroy({ where: { id: { [Op.in]: itemIds } } })
        return Promise.resolve(true)
      })
      await Order.destroy({ where: { workspaceId: req.params.id } })
      await Customer.destroy({ where: { workspaceId: req.params.id } })
      await Item.findAll({
        attributes: ['id'],
        include: [
          {
            model: Manufacturer,
            as: 'manufacturer',
            where: { workspaceId: req.params.id },
          },
        ],
        raw: true,
      }).then(async function (items) {
        const itemIds = items.map((el) => el.id)
        if (itemIds.length === 0) return Promise.resolve(true) //nothing to delete
        await Item.destroy({ where: { id: { [Op.in]: itemIds } } })
        return Promise.resolve(true)
      })
      await Manufacturer.destroy({ where: { workspaceId: req.params.id } })

      const newCurrentWorkspace = await WorkspaceUser.findOne({
        where: {
          workspaceId: { [Op.not]: req.params.id },
          userId: req.user.id,
          roleId: role.id,
        },
        attributes: ['workspaceId'],
      })
      await User.update(
        { currentWorkspaceId: newCurrentWorkspace.workspaceId },
        {
          where: { id: req.user.id },
        },
      )
      await WorkspaceUser.destroy({ where: { workspaceId: req.params.id } })
      await Workspace.destroy({
        where: {
          id: req.params.id,
        },
      })
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
        text: 'Успішно видалено!',
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
    } else {
      return res.json({
        severity: 'success',
        text: 'Успішно видалено!',
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}

module.exports = {
  getWorkspaces,
  createWorkspace,
  updateWorkspaceById,
  deleteWorkspace,
}
