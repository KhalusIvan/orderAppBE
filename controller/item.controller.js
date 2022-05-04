const { Item, OrderItem, Sequelize } = require('../models')
const { Op } = require('sequelize')

const getItems = async (req, res) => {
  try {
    let result
    const whereWorkspace = { workspaceId: req.user.workspaceId }
    const whereRequest = {}
    if (req.query.manufacturerId) {
      const values = req.query.manufacturerId.split(',')
      whereRequest.manufacturerId =
        values.length === 1 ? values[0] : { [Op.or]: values }
    }
    if (req.query.search) {
      whereRequest.name = { [Op.like]: `%${req.query.search}%` }
    }
    if (req.query.page) {
      const limit = +process.env.ROWS_PER_PAGE
      const offset = (+req.query.page - 1) * +process.env.ROWS_PER_PAGE
      result = await Item.findAndCountAll({
        include: [
          { model: Manufacturer, as: 'manufacturer', where: whereWorkspace },
        ],
        where: whereRequest,
        limit,
        offset,
        attributes: ['id', 'name', 'code', 'buyPrice', 'recomendedSellPrice'],
      })
      if (req.query.filter) {
        const manufacturerCount = await Item.findAll({
          where: { workspaceId: req.user.workspaceId },
          include: [
            {
              model: Manufacturer,
              as: 'manufacturer',
              where: whereWorkspace,
              attributes: ['id', 'name'],
            },
          ],
          attributes: [[Sequelize.literal('COUNT(manufacturerId)'), 'number']],
          group: 'manufacturerId',
        })
        result.manufacturer = manufacturerCount
      }
      result.pages = Math.ceil(result.count / limit)
    } else {
      result = await Item.findAll({
        include: [
          { model: Manufacturer, as: 'manufacturer', where: whereWorkspace },
        ],
        where: whereRequest,
        attributes: ['id', 'name', 'code', 'buyPrice', 'recomendedSellPrice'],
      })
    }
    return res.json(result)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}

const createItem = async (req, res) => {
  try {
    if (!req.body.name || !req.body.code || !req.body.manufacturerId)
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })
    const isManufacturer = await Manufacturer.findByPk(req.body.manufacturerId)
    if (!isManufacturer)
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })

    const workspaceId = req.user.workspaceId

    const sameItem = await Item.findOne({
      where: { code: req.body.code },
      include: [
        {
          model: Manufacturer,
          as: 'manufacturer',
          where: { workspaceId: workspaceId },
        },
      ],
    })

    if (sameItem)
      return res.status(406).json({
        severity: 'error',
        text: 'Дана назва вже використовується!',
      })
    const item = await Item.create({
      name: req.body.name,
      code: req.body.code,
      buyPrice: req.body.buyPrice,
      recomendedSellPrice: req.body.recomendedSellPrice,
      manufacturerId: req.body.manufacturerId,
    })
    return res.json({
      severity: 'success',
      text: 'Успішно додано!',
      item,
    })
  } catch (err) {
    return res.status(500).json({ err })
  }
}

const updateItemById = async (req, res) => {
  try {
    if (!req.body.name || !req.body.code || !req.body.manufacturerId)
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })
    if (req.body.manufacturerId) {
      const isManufacturer = await Manufacturer.findByPk(
        req.body.manufacturerId,
      )
      if (!isManufacturer)
        return res.status(406).json({
          severity: 'error',
          text: 'Введено некоректні інформацію!',
        })
    }

    const workspaceId = req.user.workspaceId

    const sameItem = await Item.findOne({
      where: { code: req.body.code, id: { [Op.not]: req.params.id } },
      include: [
        {
          model: Manufacturer,
          as: 'manufacturer',
          where: { workspaceId: workspaceId },
        },
      ],
    })
    if (sameItem)
      return res.status(406).json({
        severity: 'error',
        text: 'Дана назва вже використовується!',
      })

    const item = await Item.update(req.body, {
      where: { id: req.params.id },
    })
    return res.json({
      severity: 'success',
      text: 'Успішно оновлено!',
      item,
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

const deleteItem = async (req, res) => {
  try {
    const item = await OrderItem.findOne({
      where: { itemId: req.params.id },
    })
    if (item)
      return res.status(406).json({
        severity: 'error',
        text: 'Спочатку видаліть всю продукцію!',
      })
    await Item.destroy({
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
  getItems,
  createItem,
  updateItemById,
  deleteItem,
}
