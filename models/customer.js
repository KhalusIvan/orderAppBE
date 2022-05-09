"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.belongsTo(models.Workspace, {
        foreignKey: "workspaceId",
        onDelete: "CASCADE",
      });
    }
  }
  Customer.init(
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      middleName: DataTypes.STRING,
      city: DataTypes.STRING,
      postOffice: DataTypes.INTEGER,
      telephone: { type: DataTypes.STRING, allowNull: false },
      workspaceId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Customer",
    }
  );
  return Customer;
};
