"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Manufacturers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      currencyId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "RESTRICT",
        references: {
          model: "Currencies",
          key: "id",
          as: "currencyId",
        },
      },
      workspaceId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "RESTRICT",
        references: {
          model: "Workspaces",
          key: "id",
          as: "workspaceId",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Manufacturers");
  },
};
