"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WorkspaceUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WorkspaceUser.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      WorkspaceUser.belongsTo(models.Role, {
        as: "role",
        foreignKey: "roleId",
        onDelete: "CASCADE",
      });
      WorkspaceUser.belongsTo(models.Workspace, {
        as: "workspace",
        foreignKey: "workspaceId",
        onDelete: "CASCADE",
      });
    }
  }
  WorkspaceUser.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      roleId: { type: DataTypes.INTEGER, allowNull: false },
      workspaceId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "WorkspaceUser",
    }
  );
  return WorkspaceUser;
};
