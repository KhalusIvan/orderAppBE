"use strict";
const { Model } = require("sequelize");
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
        foreignKey: "statusId",
        onDelete: "CASCADE",
      });
      Order.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Order.belongsTo(models.Customer, {
        foreignKey: "customerId",
        onDelete: "CASCADE",
      });
      Order.hasMany(models.OrderItem, { foreignKey: "orderId" });
    }
  }
  Order.init(
    {
      postCode: DataTypes.STRING,
      statusId: DataTypes.INTEGER,
      userId: { type: DataTypes.INTEGER, allowNull: false },
      customerId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
