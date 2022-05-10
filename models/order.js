'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Status, {
        as: 'status',
        foreignKey: 'statusId',
        onDelete: 'CASCADE',
      })
      Order.belongsTo(models.Payment, {
        as: 'payment',
        foreignKey: 'paymentId',
        onDelete: 'CASCADE',
      })
      Order.belongsTo(models.Customer, {
        as: 'customer',
        foreignKey: 'customerId',
        onDelete: 'CASCADE',
      })
      Order.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      })
      Order.hasMany(models.OrderItem, { as: 'items', foreignKey: 'orderId' })
    }
  }
  Order.init(
    {
      postCode: DataTypes.STRING,
      statusId: DataTypes.INTEGER,
      paymentId: DataTypes.INTEGER,
      userId: { type: DataTypes.INTEGER, allowNull: false },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      middleName: DataTypes.STRING,
      city: DataTypes.STRING,
      postOffice: DataTypes.INTEGER,
      telephone: { type: DataTypes.STRING, allowNull: false },
      workspaceId: { type: DataTypes.INTEGER, allowNull: false },
      customerId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Order',
    },
  )
  return Order
}
