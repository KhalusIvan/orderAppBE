const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "order_item",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      buyPrice: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      sellPrice: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "order_items",
    }
  );
};
