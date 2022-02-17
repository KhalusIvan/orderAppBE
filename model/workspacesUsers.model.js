const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("workspace_user", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: "workspaces_users",
  });
};
