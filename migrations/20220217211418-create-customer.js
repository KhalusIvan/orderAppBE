"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Customers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      middleName: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      postOffice: {
        type: Sequelize.INTEGER,
      },
      telephone: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Customers");
  },
};
