'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      buyPrice: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      sellPrice: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      orderId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "RESTRICT",
        references: {
          model: "Orders",
          key: "id",
          as: "orderId",
        },
      },
      itemId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "RESTRICT",
        references: {
          model: "Items",
          key: "id",
          as: "itemId",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderItems');
  }
};