const { WorkspaceUser, Role, User, Sequelize } = require('../models')
const { Op } = require('sequelize')

const getEmployees = async (req, res) => {
  try {
    let result
    const whereWorkspace = { workspaceId: req.user.workspaceId }
    const whereRequestUser = {}
    const whereRequestRole = {}
    if (req.query.search) {
      whereRequestUser[Op.or] = [
        { firstName: { [Op.like]: `%${req.query.search}%` } },
        { lastName: { [Op.like]: `%${req.query.search}%` } },
        { email: { [Op.like]: `%${req.query.search}%` } },
      ]
    }
    if (req.query.page) {
      const limit = +process.env.ROWS_PER_PAGE
      const offset = (+req.query.page - 1) * +process.env.ROWS_PER_PAGE
      result = await WorkspaceUser.findAndCountAll({
        where: whereWorkspace,
        includes: [
          { model: Role, as: 'role', where: whereRequestRole },
          { model: User, as: 'user', where: whereRequestUser },
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
      result.pages = Math.ceil(result.count / limit)
    } else {
      result = await WorkspaceUser.findAll({
        where: whereWorkspace,
        includes: [
          { model: Role, as: 'role', where: whereRequestRole },
          { model: User, as: 'user', where: whereRequestUser },
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

module.exports = {
  getEmployees,
}
