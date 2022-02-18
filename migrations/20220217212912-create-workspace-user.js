'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WorkspaceUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      roleId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "RESTRICT",
        references: {
          model: "Roles",
          key: "id",
          as: "roleId",
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
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WorkspaceUsers');
  }
};