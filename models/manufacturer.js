"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Manufacturer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Manufacturer.hasMany(models.Item, { foreignKey: "manufecturerId" });
      Manufacturer.belongsTo(models.Currency, {
        foreignKey: "currencyId",
        onDelete: "CASCADE",
      });
      Manufacturer.belongsTo(models.Workspace, {
        foreignKey: "workspaceId",
        onDelete: "CASCADE",
      });
    }
  }
  Manufacturer.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      currencyId: { type: DataTypes.INTEGER, allowNull: false },
      workspaceId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Manufacturer",
    }
  );
  return Manufacturer;
};
