"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderItem.belongsTo(models.Order, {
        foreignKey: "orderId",
        onDelete: "CASCADE",
      });
      OrderItem.belongsTo(models.Item, {
        foreignKey: "itemId",
        onDelete: "CASCADE",
      });
    }
  }
  OrderItem.init(
    {
      buyPrice: { type: DataTypes.INTEGER, allowNull: false },
      sellPrice: { type: DataTypes.INTEGER, allowNull: false },
      orderId: { type: DataTypes.INTEGER, allowNull: false },
      itemId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "OrderItem",
    }
  );
  return OrderItem;
};
