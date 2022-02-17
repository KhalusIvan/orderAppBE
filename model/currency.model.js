const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("currency", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    code: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  }, {
    tableName: "currencies",
  });
};
