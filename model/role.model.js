const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("role", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    default: {
      type: DataTypes.BOOLEAN,
      default: false,
    }
  }, {
    tableName: "roles",
  });
};
