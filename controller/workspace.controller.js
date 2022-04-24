const { Workspace, Role, User, WorkspaceUser } = require('../models')
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
      result.pages = Math.ceil(result.count / limit)
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
    return res.json({
      severity: 'success',
      text: 'Успішно оновлено!',
      workspace,
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

module.exports = {
  getWorkspaces,
  createWorkspace,
  updateWorkspaceById,
}
