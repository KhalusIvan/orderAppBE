const { Customer, Order, Sequelize } = require('../models')
const { Op } = require('sequelize')

const getCustomers = async (req, res) => {
  try {
    let result
    const whereRequest = { workspaceId: req.user.workspaceId }
    if (req.query.search) {
      whereRequest[Op.or] = [
        { firstName: { [Op.like]: `%${req.query.search}%` } },
        { lastName: { [Op.like]: `%${req.query.search}%` } },
        { telephone: { [Op.like]: `%${req.query.search}%` } },
      ]
    }
    if (req.query.page) {
      const limit = +process.env.ROWS_PER_PAGE
      const offset = (+req.query.page - 1) * +process.env.ROWS_PER_PAGE
      result = await Customer.findAndCountAll({
        where: whereRequest,
        limit,
        offset,
        attributes: [
          'id',
          'firstName',
          'lastName',
          'middleName',
          'city',
          'postOffice',
          'telephone',
        ],
      })
      if (req.query.filter) {
        /*const manufacturerCount = await Item.findAll({
          include: [
            {
              model: Manufacturer,
              as: 'manufacturer',
              where: whereWorkspace,
              attributes: ['id', 'name'],
            },
          ],
          where: whereRequest,
          attributes: [[Sequelize.literal('COUNT(manufacturerId)'), 'number']],
          group: 'manufacturerId',
        })
        result.manufacturer = manufacturerCount*/
      }
      result.pages = Math.max(Math.ceil(result.count / limit), 1)
    } else {
      result = await Customer.findAll({
        where: whereRequest,
        attributes: [
          'id',
          'firstName',
          'lastName',
          'middleName',
          'city',
          'postOffice',
          'telephone',
        ],
      })
    }
    return res.json(result)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}

const createCustomer = async (req, res) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.city ||
      !req.body.postOffice ||
      !req.body.telephone
    )
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })

    const workspaceId = req.user.workspaceId

    const sameCustomer = await Customer.findOne({
      where: { telephone: req.body.telephone, workspaceId: workspaceId },
    })

    if (sameCustomer)
      return res.status(406).json({
        severity: 'error',
        text: 'Дана телефон вже використовується!',
      })
    const customer = await Customer.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName || null,
      city: req.body.city || null,
      postOffice: req.body.postOffice || null,
      telephone: req.body.telephone,
      workspaceId,
    })
    return res.json({
      severity: 'success',
      text: 'Успішно додано!',
      customer,
    })
  } catch (err) {
    return res.status(500).json({ err })
  }
}

const updateCustomerById = async (req, res) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.city ||
      !req.body.postOffice ||
      !req.body.telephone
    )
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })

    const workspaceId = req.user.workspaceId

    const sameCustomer = await Customer.findOne({
      where: {
        telephone: req.body.telephone,
        workspaceId: workspaceId,
        id: { [Op.not]: req.params.id },
      },
    })

    if (sameCustomer)
      return res.status(406).json({
        severity: 'error',
        text: 'Даний телефон вже використовується!',
      })

    const customer = await Customer.update(req.body, {
      where: { id: req.params.id },
    })
    return res.json({
      severity: 'success',
      text: 'Успішно оновлено!',
      customer,
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Order.findOne({
      where: { customerId: req.params.id },
    })
    if (customer)
      return res.status(406).json({
        severity: 'error',
        text: 'Спочатку видаліть всі замовлення!',
      })
    await Customer.destroy({
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
  getCustomers,
  createCustomer,
  updateCustomerById,
  deleteCustomer,
}
