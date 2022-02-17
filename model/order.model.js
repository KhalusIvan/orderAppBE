const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("order", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    post_code: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: "orders",
  });
};
