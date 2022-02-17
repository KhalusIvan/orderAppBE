const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("status", {
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
    icon: {
      type: DataTypes.STRING,
    }
  }, {
    tableName: "statuses",
  });
};
