const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("item", {
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
    code: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    buyPrice: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    recomendedSellPrice: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: "items",
  });
};
