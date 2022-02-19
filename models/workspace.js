"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Workspace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Workspace.hasMany(models.Customer, { foreignKey: "workspaceId" });
      Workspace.hasMany(models.Manufacturer, {
        as: "manufacturers",
        foreignKey: "workspaceId",
      });
      Workspace.hasMany(models.WorkspaceUser, { foreignKey: "workspaceId" });
      Workspace.hasMany(models.User, { foreignKey: "currentWorkspaceId" });
      Workspace.belongsToMany(models.User, {
        through: "WorkspaceUser",
        as: "users",
      });
    }
  }
  Workspace.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Workspace",
    }
  );
  return Workspace;
};
