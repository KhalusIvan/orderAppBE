'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.belongsTo(models.Manufacturer, {
        as: "manufacturer",
        foreignKey: "manufacturerId",
        onDelete: "CASCADE",
      });
      Item.hasMany(models.OrderItem, { foreignKey: "itemId" });
    }
  }
  Item.init({
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    buyPrice: { type: DataTypes.FLOAT, allowNull: false },
    recomendedSellPrice: { type: DataTypes.FLOAT, allowNull: false },
    manufacturerId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};