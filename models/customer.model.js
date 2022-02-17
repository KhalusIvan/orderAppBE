const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("customer", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    middleName: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    postOffice: {
      type: DataTypes.INTEGER,
    },
    telephone: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    tableName: "customers",
  });
};
