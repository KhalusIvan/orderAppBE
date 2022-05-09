"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      postCode: {
        type: Sequelize.STRING,
      },
      statusId: {
        type: Sequelize.INTEGER,
        onDelete: "RESTRICT",
        references: {
          model: "Statuses",
          key: "id",
          as: "statusId",
        },
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "RESTRICT",
        references: {
          model: "Users",
          key: "id",
          as: "userId",
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
    await queryInterface.dropTable("Orders");
  },
};
