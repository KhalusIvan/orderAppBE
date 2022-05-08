"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Status.hasMany(models.Order, { foreignKey: "statusId" });
    }
  }
  Status.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      finish: { type: DataTypes.BOOLEAN, allowNull: false },
      icon: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Status",
    }
  );
  return Status;
};
