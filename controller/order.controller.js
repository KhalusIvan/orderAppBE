const {
  Order,
  OrderItem,
  Status,
  Customer,
  Payment,
  Item,
  User,
  Manufacturer,
  Currency,
  Sequelize,
} = require('../models')
const { Op } = require('sequelize')

const getOrders = async (req, res) => {
  try {
    let result
    const whereRequest = { workspaceId: req.user.workspaceId }
    if (req.query.statusId) {
      const values = req.query.statusId.split(',')
      whereRequest.statusId =
        values.length === 1 ? values[0] : { [Op.or]: values }
    }
    if (req.query.paymentId) {
      const values = req.query.paymentId.split(',')
      whereRequest.paymentId =
        values.length === 1 ? values[0] : { [Op.or]: values }
    }
    if (req.query.search) {
      whereRequest[Op.or] = [
        { firstName: { [Op.like]: `%${req.query.search}%` } },
        { lastName: { [Op.like]: `%${req.query.search}%` } },
      ]
    }
    if (req.query.page) {
      const limit = +process.env.ROWS_PER_PAGE
      const offset = (+req.query.page - 1) * +process.env.ROWS_PER_PAGE
      result = await Order.findAndCountAll({
        include: [
          {
            model: Status,
            as: 'status',
            attributes: ['id', 'name', 'finish'],
          },
          {
            model: Payment,
            as: 'payment',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName'],
          },
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Item,
                as: 'item',
                include: [
                  {
                    model: Manufacturer,
                    as: 'manufacturer',
                    include: [
                      {
                        model: Currency,
                        as: 'currency',
                        attributes: ['code'],
                      },
                    ],
                  },
                ],
                attributes: [
                  'id',
                  'name',
                  'code',
                  'buyPrice',
                  'recomendedSellPrice',
                ],
              },
            ],
            attributes: ['id', 'buyPrice', 'sellPrice', 'amount'],
          },
        ],
        where: whereRequest,
        limit,
        offset,
        order: [['id', 'DESC']],
        attributes: [
          'id',
          'postCode',
          'createdAt',
          'firstName',
          'lastName',
          'middleName',
          'city',
          'telephone',
          'postOffice',
        ],
      })
      if (req.query.filter) {
        const statusCount = await Order.findAll({
          include: [
            {
              model: Status,
              as: 'status',
              attributes: ['id', 'name'],
            },
          ],
          attributes: [[Sequelize.literal('COUNT(statusId)'), 'number']],
          group: 'statusId',
        })
        result.status = statusCount
        const paymentCount = await Order.findAll({
          include: [
            {
              model: Payment,
              as: 'payment',
              attributes: ['id', 'name'],
            },
          ],
          attributes: [[Sequelize.literal('COUNT(paymentId)'), 'number']],
          group: 'paymentId',
        })
        result.payment = paymentCount
      }
      result.pages = Math.max(Math.ceil(result.count / limit), 1)
    } else {
      result = await Order.findAll({
        include: [
          {
            model: Status,
            as: 'status',
            attributes: ['id', 'name', 'finish'],
          },
          {
            model: Payment,
            as: 'payment',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName'],
          },
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Item,
                as: 'item',
                include: [
                  {
                    model: Manufacturer,
                    as: 'manufacturer',
                    include: [
                      {
                        model: Currency,
                        as: 'currency',
                        attributes: ['code'],
                      },
                    ],
                  },
                ],
                attributes: [
                  'id',
                  'name',
                  'code',
                  'buyPrice',
                  'recomendedSellPrice',
                ],
              },
            ],
            attributes: ['id', 'buyPrice', 'sellPrice', 'amount'],
          },
        ],
        where: whereRequest,
        limit,
        offset,
        order: ['id', 'DESC'],
        attributes: [
          'id',
          'postCode',
          'createdAt',
          'firstName',
          'lastName',
          'middleName',
          'city',
          'telephone',
          'postOffice',
        ],
      })
    }
    return res.json(result)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}

const createOrder = async (req, res) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.city ||
      !req.body.postOffice ||
      !req.body.telephone ||
      !req.body.statusId ||
      !req.body.paymentId
    )
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })

    const workspaceId = req.user.workspaceId

    if (req.body.updateCustomer) {
      let customerId = req.body.customerId
      if (!customerId) {
        const customer = await Customer.findOne({
          where: { telephone: req.body.telephone, workspaceId: workspaceId },
        })
        customerId = customer?.id
      }

      if (!customerId) {
        const customer = await Customer.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          middleName: req.body.middleName || null,
          city: req.body.city,
          postOffice: req.body.postOffice,
          telephone: req.body.telephone,
          workspaceId,
        })
        customerId = customer.id
      } else {
        await Customer.update(
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            middleName: req.body.middleName || null,
            city: req.body.city,
            postOffice: req.body.postOffice,
            telephone: req.body.telephone,
          },
          {
            where: { id: customerId },
          },
        )
      }
    }

    const order = await Order.create({
      statusId: req.body.statusId,
      paymentId: req.body.paymentId,
      userId: req.user.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName || null,
      city: req.body.city,
      postOffice: req.body.postOffice,
      telephone: req.body.telephone,
      workspaceId,
    })
    const orderItem = req.body.order.map((el) => ({ ...el, orderId: order.id }))
    await OrderItem.bulkCreate(orderItem)
    return res.json({
      severity: 'success',
      text: 'Успішно додано!',
      order,
    })
  } catch (err) {
    return res.status(500).json({ err })
  }
}

const updateOrderById = async (req, res) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.city ||
      !req.body.postOffice ||
      !req.body.telephone ||
      !req.body.statusId ||
      !req.body.paymentId
    )
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })

    const workspaceId = req.user.workspaceId

    if (req.body.updateCustomer) {
      let customerId = req.body.customerId
      if (!customerId) {
        const customer = await Customer.findOne({
          where: { telephone: req.body.telephone, workspaceId: workspaceId },
        })
        customerId = customer?.id
      }

      if (!customerId) {
        const customer = await Customer.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          middleName: req.body.middleName || null,
          city: req.body.city,
          postOffice: req.body.postOffice,
          telephone: req.body.telephone,
          workspaceId,
        })
        customerId = customer.id
      } else {
        await Customer.update(
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            middleName: req.body.middleName || null,
            city: req.body.city,
            postOffice: req.body.postOffice,
            telephone: req.body.telephone,
          },
          {
            where: { id: customerId },
          },
        )
      }
    }

    for await (let item of req.body.order) {
      if (item.id) {
        let update = {
          buyPrice: item.buyPrice,
          sellPrice: item.sellPrice,
          amount: item.amount,
        }
        await OrderItem.update(update, {
          where: { id: item.id },
        })
      } else {
        await OrderItem.create({
          buyPrice: item.buyPrice,
          sellPrice: item.sellPrice,
          amount: item.amount,
          itemId: item.itemId,
          orderId: req.params.id,
        })
      }
    }

    if (Array.isArray(req.body.orderDelete)) {
      await OrderItem.destroy({
        where: { id: { [Op.in]: req.body.orderDelete } },
      })
    }

    const order = await Order.update(
      {
        statusId: req.body.statusId,
        paymentId: req.body.paymentId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName || null,
        city: req.body.city,
        postOffice: req.body.postOffice,
        telephone: req.body.telephone,
      },
      { where: { id: req.params.id } },
    )
    return res.json({
      severity: 'success',
      text: 'Успішно оновлено!',
      order,
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

const finishOrderById = async (req, res) => {
  try {
    const finishStatus = await Status.findOne({ where: { finish: true } })
    const order = await Order.update(
      {
        statusId: finishStatus.id,
      },
      { where: { id: req.params.id } },
    )
    for await (let item of req.body.order) {
      let update = {
        buyPrice: item.buyPrice,
      }
      await OrderItem.update(update, {
        where: { id: item.id },
      })
    }
    return res.json({
      severity: 'success',
      text: 'Успішно оновлено!',
      order,
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

const deleteOrder = async (req, res) => {
  try {
    await OrderItem.destroy({
      where: {
        orderId: req.params.id,
      },
    })
    await Order.destroy({
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
  getOrders,
  createOrder,
  updateOrderById,
  finishOrderById,
  deleteOrder,
}